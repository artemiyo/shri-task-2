const declOfNum = (n, titles) => {
	return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
}

const sortByValueText = (a, b) => {
	if (a.valueText === b.valueText) {
		return a.name.localeCompare(b.name)
	} else {
		return b.valueText.localeCompare(a.valueText, "ru-u-kn-true")
	}
}

/** 
 * @function Получение обработанных данных и их фильтрация по номеру спринта
 * @param entities - список всех данных
 * @param currentSprintDuration - длительность спринта
 */
const getPreparedEntities = (entities, currentSprintDuration) => {
	const [start, finish] = currentSprintDuration;
	const preparedEntities = {
		"Comment": [],
		"Commit": [],
		"Issue": [],
		"Project": [],
		"Sprint": [],
		"Summary": [],
		"User": []
	}

	const commitEntities = entities.filter(entity => entity.type === "Commit")

	const filteredEntitiesBySprint = entities.filter((entity) => {
		if (entity.type === "Issue" || entity.type === "Comment") {
			return entity.createdAt >= start && entity.createdAt <= finish
		}
		if (entity.type === "Commit") {
			return entity.timestamp >= start && entity.timestamp <= finish
		}
		return entity
	})

	for (const [key, value] of Object.entries(preparedEntities)) {
		value.push(...filteredEntitiesBySprint.filter(entity => entity.type === key))
	}

	return { commitEntities, preparedEntities }
}

/** 
 * @function Получение количества коммитов в каждом спринте
 * @param commitEntities - список всех коммитов
 * @param sprints - список спринтов
 * @param sprintId - id текущего спринта
 */

const getValues = (commitEntities, sprints, sprintId) => {
	const sprintsObject = sprints.reduce((acc, cur) => ({ ...acc, [cur.id]: [] }), {})
	const sprintsTime = sprints.reduce((acc, cur) => ({ ...acc, [cur.id]: [cur.startAt, cur.finishAt] }), {});

	for (const [key, value] of Object.entries(sprintsTime)) {
		const commitsCount = commitEntities.filter(entity => entity.timestamp >= value[0] && entity.timestamp <= value[1])
		sprintsObject[key].push(commitsCount)
	}

	const setActiveSprint = sprint => {
		const sprintObj = {
			title: sprint.id.toString(),
			hint: sprint.name,
			value: sprintsObject[sprint.id][0].length
		}

		if (sprint.id === sprintId) {
			sprintObj.active = true
		}

		return sprintObj
	}

	return sprints.map(setActiveSprint).sort((a, b) => a.title.localeCompare(b.title, "ru-u-kn-true"))
}

/** 
 * @function Получение данных "users" для alias "vote" и "leaders"
 * @param preparedEntities - entities
 * @param type - тип entity
 */
const getUsers = (preparedEntities, type) => {
	const users = preparedEntities[type].reduce((acc, cur) => {
		const usersObject = { ...acc, [cur.author]: [] };
		return usersObject
	}, {});

	preparedEntities[type].forEach((entity) => {
		const entityData = type === "Commit" ? entity.summaries : entity.likes;
		if (Array.isArray(entityData) && entityData.length) {
			users[entity.author].push(entityData);
		}
	})

	return preparedEntities["User"].map(user => {
		const word = declOfNum(users[user.id]?.flat().length, ["голос", "голоса", "голосов"])
		const commitValueText = Array.isArray(users[user.id]) && users[user.id].length ? `${users[user.id].length}` : "0";
		const voteValueText = Array.isArray(users[user.id]) && users[user.id].length ? `${users[user.id].flat().length} ${word}` : "0 голосов"

		return {
			id: user.id,
			name: user.name,
			avatar: user.avatar,
			valueText: type === "Commit" ? commitValueText : voteValueText
		}
	}).sort(sortByValueText)
}

/** 
 * @function Получение размеров коммитов
 * @param preparedEntities - entities
 */
const getSummariesWithSumValues = (preparedEntities) => {
	const commitSummaries = preparedEntities["Commit"].map(({ summaries }) => summaries).flat();
	const summaries = preparedEntities["Summary"].filter(({ id }) => commitSummaries.includes(id));
	const sumValues = summaries.reduce((acc, { id, added, removed }) => ({ ...acc, [id]: { sum: added + removed } }), {})

	const summariesWithSumValues = preparedEntities["Commit"].map(commit => ({
		...commit,
		summariesValue: commit.summaries.map(summary => ({ ...sumValues[summary] })).reduce((acc, { sum }) => acc + sum, 0)
	}));

	return summariesWithSumValues
}

/** 
 * @function Получение количества коммитов по условиям   
 * @param summaries - данные типа "Summaries"
 */
const getFilteredSummaries = (summaries) => {
	const filterOne = summaries.filter(a => a.summariesValue >= 1001);
	const filterTwo = summaries.filter(a => a.summariesValue >= 501 && a.summariesValue <= 1000);
	const filterThree = summaries.filter(a => a.summariesValue >= 101 && a.summariesValue <= 500);
	const filterFour = summaries.filter(a => a.summariesValue >= 1 && a.summariesValue <= 100);

	return [
		filterOne.length,
		filterTwo.length,
		filterThree.length,
		filterFour.length
	]
}

/** 
 * @function Получение данных по активности команды
 * @param commits - данные типа "Сommits"
 */
const getActivity = (commits) => {
	const days = {
		"sun": {},
		"mon": {},
		"tue": {},
		"wed": {},
		"thu": {},
		"fri": {},
		"sat": {}
	}

	const commitsWithDate = commits.map(commit => ({
		...commit,
		day: new Intl.DateTimeFormat("en-Us", { weekday: "short" }).format(new Date(commit.timestamp)).toLocaleLowerCase(),
		hour: new Date(commit.timestamp).getHours()
	}))


	for (const [key, value] of Object.entries(days)) {
		const filteredCommitsWithDate = commitsWithDate.filter(commit => commit.day === key).map(commit => commit.hour)
		filteredCommitsWithDate.forEach((commitHour) => {
			days[key][commitHour] = (days[key][commitHour] || 0) + 1
		})
		days[key] = new Array(24).fill(0).map((el, index) => value[index] ? el = value[index] : el)
	}

	return days
}


/** 
 * @function Получение данных для диаграммы
 * @param currentEntities - entities текущего спринта
 * @param prevEntities - entities предыдущего спринта
 */

const getDiagramCategoriesData = (currentEntities, prevEntities) => {
	const currentSummaries = getSummariesWithSumValues(currentEntities)
	const prevSummaries = getSummariesWithSumValues(prevEntities);

	const difference = currentSummaries.length - prevSummaries.length;

	const currentCategories = getFilteredSummaries(currentSummaries);
	const prevCategories = getFilteredSummaries(prevSummaries);

	const getDifference = (index) => currentCategories[index] - prevCategories[index];
	const getCommitsWord = (value) => declOfNum(value, ['коммит', "коммита", "коммитов"]);

	const getCategoryValueText = (index) => `${currentCategories[index]} ${getCommitsWord(currentCategories[index])}`;
	const getCategoryDiffText = (index) => `${getDifference(index) > 0 ? "+" : ""}${getDifference(index)} ${getCommitsWord(Math.abs(currentCategories[index]))}`

	const diagramCategoriesData = [
		{ title: "> 1001 строки", valueText: getCategoryValueText(0), differenceText: getCategoryDiffText(0) },
		{ title: "501 — 1000 строк", valueText: getCategoryValueText(1), differenceText: getCategoryDiffText(1) },
		{ title: "101 — 500 строк", valueText: getCategoryValueText(2), differenceText: getCategoryDiffText(2) },
		{ title: "1 — 100 строк", valueText: getCategoryValueText(3), differenceText: getCategoryDiffText(3) }
	]

	return { diagramCategoriesData, difference }

}

function prepareData(entities, { sprintId }) {
	const currentSprint = entities.filter(entity => entity.type === "Sprint").find(sprint => sprint.id === sprintId);
	const previousSprint = entities.filter(entity => entity.type === "Sprint").find(sprint => sprint.id === sprintId - 1);
	let currentSprintDuration = [currentSprint.startAt, currentSprint.finishAt];
	let previousSprintDuration = [previousSprint.startAt, previousSprint.finishAt];

	const { commitEntities, preparedEntities } = getPreparedEntities(entities, currentSprintDuration);
	const prevPreparedEntities = getPreparedEntities(entities, previousSprintDuration);

	const values = getValues(commitEntities, preparedEntities["Sprint"], sprintId);
	const activity = getActivity(preparedEntities["Commit"]);
	const { diagramCategoriesData, difference } = getDiagramCategoriesData(preparedEntities, prevPreparedEntities.preparedEntities)

	return [
		{
			alias: "leaders",
			data: {
				title: "Больше всего коммитов",
				subtitle: currentSprint.name,
				emoji: "👑",
				users: getUsers(preparedEntities, "Commit")
			}
		},
		{
			alias: "vote",
			data: {
				title: "Самый 🔎 внимательный разработчик",
				subtitle: currentSprint.name,
				emoji: "🔎",
				users: getUsers(preparedEntities, "Comment")
			}
		},
		{
			alias: "chart",
			data: {
				title: "Коммиты",
				subtitle: currentSprint.name,
				values,
				users: getUsers(preparedEntities, "Commit")
			}
		},
		{
			alias: "diagram",
			data: {
				title: "Размер коммитов",
				subtitle: currentSprint.name,
				totalText: `${preparedEntities["Commit"].length} коммита`,
				differenceText: `${difference > 0 ? "+" : "-"}${Math.abs(difference)} с прошлого спринта`,
				categories: diagramCategoriesData
			}
		},
		{
			alias: "activity",
			data: {
				title: "Коммиты",
				subtitle: currentSprint.name,
				data: activity
			}
		}
	]
}

module.exports = { prepareData }