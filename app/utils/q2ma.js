const q2m = require("query-to-mongo")
const bson = require("bson")

const defaultDateFieldNames = ["createdAt", "modifiedAt", "updatedAt", "removedAt", "deletedAt", "verifiedAt", "confirmedAt", "timestamp"]
const isEmpty = data => Object.entries(data).length === 0 && data.constructor === Object

/**
 * @param  {('DATE'|'NUMBER')} format
 * @example
 *
 *   convertDateNumberToDate ({_id: "d6fg45df56g16", createdAt: { "$gt": "2019-09-08T11:45:02.478Z" }}, updatedAt: {"$lt": 1564776541684}}, )
 *   returns: {_id: "d6fg45df56g16", createdAt: { "$gt": DATE }}, updatedAt: {"$lt": DATE}}
 */

const dateConvert = (dateFilterValue, format = "DATE") => {
	if (typeof dateFilterValue === "string" || typeof dateFilterValue === "number") {
		const date = new Date(dateFilterValue)
		return format == "NUMBER" ? date.getTime() : date
	}
	return dateFilterValue
}

function normalizeCriteria (obj, { dateFields = defaultDateFieldNames, dateFormat }) {
	for (let key in obj) {
		if (typeof obj[key] === "object") normalizeCriteria(obj[key], { dateFields, dateFormat })

		if (dateFields.includes(key)) obj[key] = dateConvert(obj[key], { dateFields, dateFormat })

		if (typeof obj[key] === "object" && defaultDateFieldNames.includes(key))
			Object.keys(obj[key]).forEach(val => (obj[key][val] = dateConvert(obj[key][val], { dateFields, dateFormat })))

		if (key.includes("_id") && typeof obj[key] !== "object") obj[key] = new bson.ObjectID(obj[key])
	}

	return obj
}

/**
 * @param  {('START'|'END')} matchPosition
 */
function q2mPipelines ({ pipelines, queryString, dateFields, dateFormat, matchPosition = "START" }) {
	let newPiplines = []
	let {
		criteria: filter = {},
		options: { fields, sort = {}, skip = 0, limit = 10 },
		links,
	} = q2m(queryString)
	filter = normalizeCriteria(filter, { dateFields, dateFormat })

	if (matchPosition === "START" && !isEmpty(filter)) newPiplines.push({ $match: filter })

	if (pipelines) newPiplines = [...newPiplines, ...pipelines]

	if (matchPosition === "END" && !isEmpty(filter)) newPiplines.push({ $match: filter })

	const facetPipLines = {
		$facet: {
			total: [{ $group: { _id: "total", sum: { $sum: 1 } } }],
			pagedResult: [],
		},
	}

	// Defualt sort base on _id with the -1, that's mean descending! :) beacuse the _id is a function of time
	if (!sort.hasOwnProperty("_id")) Object.assign(sort, { _id: -1 })

	if (sort) facetPipLines["$facet"].pagedResult.push({ $sort: sort })

	if (skip) facetPipLines["$facet"].pagedResult.push({ $skip: skip })

	if (limit) facetPipLines["$facet"].pagedResult.push({ $limit: limit })

	if (fields) facetPipLines["$facet"].pagedResult.push({ $project: fields })

	newPiplines = [...newPiplines, facetPipLines]

	return newPiplines
}

const pagedAggregate = async (collectionName, pagedPipelines) => {
	try {
		const result = await collectionName.aggregate(pagedPipelines)

		if (!(result[0] && result[0].pagedResult) || !(result[0] && result[0].total.length && result[0].total[0].hasOwnProperty("sum"))) return { Total: 0, Result: [] }

		return { Result: result[0].pagedResult, Total: result[0].total[0].sum }
	} catch (error) {
		throw { code: "EXCEPTION", _detail: { pagedPipelines }, _msg: "error on pagedAggregate", _innerException: error }
	}
}

const pagedFind = async (filter, project = {}, option = {}, queryString, dateFields, dateFormat, dbCollection) => {
	let {
		criteria = {},
		options: { fields = {}, sort = {}, skip = 0, limit = 20 },
		links,
	} = q2m(queryString)

	if (!option.sort) option.sort = {}
	sort = Object.assign(sort, option.sort)

	criteria = normalizeCriteria(criteria, { dateFields, dateFormat })
	// priority of merge Object are with backend not querystring
	criteria = Object.assign(criteria, filter)
	project = Object.assign(project, fields)
	option = Object.assign(option, { sort }, { skip }, { limit })

	if (!sort.hasOwnProperty("_id")) Object.assign(sort, { _id: -1 })

	const [pagedResult, sum] = await Promise.all([dbCollection.find(criteria, project, option).lean(), dbCollection.find(criteria).count()])

	return { Result: pagedResult, Total: sum }
}

const q2ma = ({ filter, project, options, pipelines, queryString, dateFields, dateFormat, matchPosition = "START", collectionName }) => {
	try {
		if (!collectionName) throw "collection Name does not specified"
		if (pipelines) {
			const newPiplines = q2mPipelines({ pipelines, queryString, dateFields, dateFormat, matchPosition })
			return pagedAggregate(collectionName, newPiplines)
		} else {
			return pagedFind(filter, project, options, queryString, dateFields, dateFormat, collectionName)
		}
	} catch (error) {
		throw { code: "EXCEPTION", _detail: { pipelines }, _msg: "error on q2ma", _innerException: error }
	}
}

module.exports = {
	pagedAggregate,
	q2mPipelines,
	q2ma,
	q2m,
}
