import entities from './examples/input.json';

// Подготовка и фильтрация данных в зависимости от спринта
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

// Получение количества коммитов в каждом спринте
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

	return sprints
		.map(sprint => {
			const sprintObj = {
				title: sprint.id.toString(),
				hint: sprint.name,
				value: sprintsObject[sprint.id][0].length
			}

			if (sprint.id === sprintId) {
				sprintObj.active = true
			}

			return sprintObj

		}).sort((a, b) => a.title.localeCompare(b.title, "ru-u-kn-true"))
}


const getUsers = (preparedEntities, type) => {
	const usersObj = preparedEntities[type].reduce((acc, cur) => {
		const obj = { ...acc, [cur.author]: [] };
		return obj
	}, {});

	preparedEntities[type].forEach((entity) => {
		const entityData = type === "Commit" ? entity.summaries : entity.likes;
		if (Array.isArray(entityData) && entityData.length) {
			usersObj[entity.author].push(entityData);
		}
	})

	return preparedEntities["User"].map(user => {
		const commitValueText = Array.isArray(usersObj[user.id]) && usersObj[user.id].length ? `${usersObj[user.id].length}` : "0";
		const voteValueText = Array.isArray(usersObj[user.id]) && usersObj[user.id].length ? `${usersObj[user.id].flat().length} голосов` : "0 голосов"

		return {
			id: user.id,
			name: user.name,
			avatar: user.avatar,
			valueText: type === "Commit" ? commitValueText : voteValueText
		}
	}).sort((a, b) => {
		if (a.valueText === b.valueText) {
			return a.name.localeCompare(b.name)
		} else {
			return b.valueText.localeCompare(a.valueText, "ru-u-kn-true")
		}
	})
}

function prepareData(entities, { sprintId }) {
	const currentSprint = entities.filter(entity => entity.type === "Sprint").find(sprint => sprint.id === sprintId);
	const previousSprint = entities.filter(entity => entity.type === "Sprint").find(sprint => sprint.id === sprintId - 1)

	let currentSprintDuration = [currentSprint.startAt, currentSprint.finishAt];
	const { commitEntities, preparedEntities } = getPreparedEntities(entities, currentSprintDuration);
	const values = getValues(commitEntities, preparedEntities["Sprint"], sprintId);

	const commitSummaries = preparedEntities["Commit"].map(({ summaries }) => summaries).flat();
	const summaries = preparedEntities["Summary"].filter(({ id }) => commitSummaries.includes(id));

	console.log(preparedEntities["Commit"])
	console.log(summaries)

	// console.log(preparedEntities["Commit"].map(commit => {
	// 	return {
	// 		...commit,
	// 		summaries: commit.summaries.map(summary => {
	// 			return {

	// 			}
	// 		})
	// 	}
	// }))

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
				differenceText: "",
				categories: []
			}
		}
	]
}

console.log(prepareData(entities, { sprintId: 977 }))