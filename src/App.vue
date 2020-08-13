<template>
  <div id="app">
    <div class="grid grid-cols-3 grid-rows-2 gap-4 h-screen text-xs text-center pl-2 p-4">
      <div class="border flex flex-col">
        <div class="text-center py-2 text-lg font-bold border-b bg-yellow-700 text-white">Surveys</div>
        <div class="flex-1">
          <div class="grid grid-cols-4 font-bold border-b py-2" style="grid-template-columns: 1fr 4fr 2fr 2fr">
            <div />
            <div class="text-left">Title</div>
            <div>Survey Runs</div>
            <div>Creation Date</div>
          </div>
          <div
            v-for="poll in polls"
            :key="poll.id"
            class="grid grid-cols-4 py-1 border-b" style="grid-template-columns: 1fr 4fr 2fr 2fr">
            <div
              class="cursor-pointer text-yellow-700"
              @click="selectedPoll = selectedPoll && selectedPoll.id === poll.id ? null : poll">
              <font-awesome-icon
                :icon="selectedPoll && selectedPoll.id === poll.id
                  ? ['far', 'check-square']
                  : ['far', 'square']"
                size="lg" />

            </div>
            <div class="text-left">{{poll.title}}</div>
            <div>{{poll.openPollRunCount}}</div>
            <div>{{poll.creationDate | monthYear}}</div>
          </div>
        </div>
      </div>
      <div class="col-start-1 border flex flex-col relative">
        <div class="text-center py-2 text-lg font-bold border-b bg-blue-600 text-white">Survey Runs</div>
        <div v-if="!selectedPoll" class="absolute w-full h-full bg-white opacity-75 flex items-center justify-center text-2xl">
          Please select a survey
        </div>
        <div class="flex-1">
          <div class="grid grid-cols-6 font-bold border-b py-2" style="grid-template-columns: 1fr 2fr 2fr 2fr 2fr 2fr">
            <div />
            <div>Started At</div>
            <div>Status</div>
            <div>Recipients</div>
            <div>FactSheets</div>
            <div>Language</div>
          </div>
          <div
            class="grid grid-cols-6 cursor-pointer mb-1 py-1 border-b" style="grid-template-columns: 1fr 2fr 2fr 2fr 2fr 2fr"
            v-for="pollRun in pollRuns"
            :key="pollRun.id">
            <div
              class="cursor-pointer text-blue-600 text-center"
              @click="selectedPollRun = selectedPollRun && selectedPollRun.id === pollRun.id ? null : pollRun">
               <font-awesome-icon
                :icon="selectedPollRun && selectedPollRun.id === pollRun.id
                  ? ['far', 'check-square']
                  : ['far', 'square']"
                size="lg" />
            </div>
            <div>{{pollRun.startTime | monthYear}}</div>
            <div>{{pollRun.status}}</div>
            <div>{{pollRun.recipientsCompleted}} / {{pollRun.recipientsTotal}}</div>
            <div>{{pollRun.factsheetsCompleted}} / {{pollRun.factsheetsTotal}}</div>
            <div>{{pollRun.language}}</div>
          </div>
        </div>

      </div>
      <div class="col-start-2 row-start-1 border relative">
        <div v-if="!selectedPollRun" class="absolute w-full h-full bg-white opacity-75 flex items-center justify-center text-2xl">
          {{selectedPoll && !selectedPollRun ? 'Please select a survey run' : ''}}
        </div>
        <div class="text-center py-2 text-lg font-bold border-b bg-red-600 text-white">FactSheets</div>
        <template v-if="pollRunFactSheetScope">
          <div class="grid grid-cols-6 font-bold border-b py-2" style="grid-template-columns: 1fr 4fr 2fr 2fr">
            <div class="cursor-pointer text-red-600" @click="toggleAllFactSheetSelection">
              <font-awesome-icon
                :icon="allFactSheetsSelected === null
                  ? ['far', 'minus-square']
                  : allFactSheetsSelected
                    ? ['far', 'check-square']
                    : ['far', 'square']"
                size="lg" />
            </div>
            <div>Name</div>
            <div>Recipient</div>
            <div>Responses</div>
          </div>
          <div
            class="grid grid-cols-6 py-1 border-b" style="grid-template-columns: 1fr 4fr 2fr 2fr"
            v-for="{ factSheet, recipients } in pollRunFactSheetScope.factSheets"
            :key="factSheet.id">
            <div
              class="cursor-pointer text-red-600"
              @click="toggleFactSheetSelection(factSheet.id)">
              <font-awesome-icon
                :icon="selectedFactSheetIndex[factSheet.id]
                  ? ['far', 'check-square']
                  : ['far', 'square']"
                size="lg" />
            </div>
            <div
              class="truncate text-red-600 underline cursor-pointer"
              @click="previewFactSheet(factSheet)">
              {{factSheet.name}}
            </div>
            <div>{{recipients.length}}</div>
            <div>{{Object.values(pollResultsIndex.factSheets[factSheet.id] || {}).length}}</div>
          </div>
        </template>
      </div>
      <div class="col-start-2 row-start-2 border relative">
        <div v-if="!selectedPollRun" class="absolute w-full h-full bg-white opacity-75 flex items-center justify-center text-2xl">
          {{selectedPoll && !selectedPollRun ? 'Please select a survey run' : ''}}
        </div>
        <div class="text-center py-2 text-lg font-bold border-b bg-teal-600 text-white">Recipients</div>
        <template v-if="pollRunFactSheetScope">
          <div class="grid grid-cols-5 font-bold border-b py-2" style="grid-template-columns: 1fr 4fr 2fr 2fr">
            <div class="cursor-pointer text-teal-600" @click="toggleAllRecipientsSelection">
              <font-awesome-icon
                :icon="allRecipientsSelected === null
                  ? ['far', 'minus-square']
                  : allFactSheetsSelected
                    ? ['far', 'check-square']
                    : ['far', 'square']"
                size="lg" />
            </div>
            <div>Name</div>
            <div>FactSheets</div>
            <div>Responses</div>
          </div>
          <div
            class="grid grid-cols-5 py-1 border-b" style="grid-template-columns: 1fr 4fr 2fr 2fr"
            v-for="{ factSheets, recipient } in pollRunFactSheetScope.recipients"
            :key="recipient.id">
            <div
              class="cursor-pointer text-teal-600"
              @click="toggleRecipientSelection(recipient.id)">
              <font-awesome-icon
                :icon="selectedRecipientIndex[recipient.id]
                  ? ['far', 'check-square']
                  : ['far', 'square']"
                size="lg" />
            </div>
            <div class="truncate">{{recipient.fullName}} <!--{{recipient.email}}--></div>
            <div>{{factSheets.length}}</div>
            <div>{{Object.values(pollResultsIndex.recipients[recipient.id] || {}).length}}</div>
          </div>
        </template>
      </div>
      <div class="col-start-3 row-start-1 row-span-2 border relative">
        <div v-if="!selectedPollRun" class="absolute w-full h-full bg-white opacity-75 flex items-center justify-center text-2xl">
          {{selectedPoll && !selectedPollRun ? 'Please select a survey run' : ''}}
        </div>
        <div class="text-center py-2 mb-4 text-lg font-bold border-b bg-green-600 text-white">Poll Results</div>
        <div class="text-left">
          <div
            v-for="(question, i) in questionnaire.questions"
            :key="question.id" class="py-2">
            <div class="mb-1 font-bold">{{i + 1}} - {{question.label}}</div>
            <div>{{getQuestionResults(question.id)}}</div>
            <div class="ml-4 py-2">
              <div
                v-for="(child, j) in question.children"
                :key="child.id"
                class="py-2">
                  <div class="mb-1 font-bold">{{i + 1}}.{{j + 1}} - {{child.label}}</div>
                  <div>{{getQuestionResults(child.id)}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'App',
  data () {
    return {
      queryCount: 0,
      baseUrl: null,
      pollApiBaseUrl: null,
      polls: [],
      selectedPoll: null,
      pollRuns: [],
      selectedPollRun: null,
      pollRunFactSheetScope: null,
      pollRunResults: null,
      selectedFactSheetIndex: {},
      selectedRecipientIndex: {}
    }
  },
  filters: {
    monthYear (val) {
      return moment(val).format('DD/MM/YYYY')
    }
  },
  methods: {
    async getPolls () {
      this.queryCount++
      try {
        const endpoint = this.pollApiBaseUrl + '/polls'
        this.polls = await this.$lx.executeParentOriginXHR('GET', endpoint)
          .then(({ body }) => JSON.parse(body).data)
      } finally {
        this.queryCount--
      }
    },
    async getPollRuns () {
      if (!this.selectedPoll) return
      this.queryCount++
      try {
        const url = `${this.pollApiBaseUrl}/polls/${this.selectedPoll.id}/pollRuns`
        const res = await this.$lx.executeParentOriginXHR('GET', url)
          .then(({ body }) => JSON.parse(body).data)
        this.pollRuns = res
      } finally {
        this.queryCount--
      }
    },
    async getPollRunFactSheetScope () {
      this.queryCount++
      try {
        // const url = `${this.pollApiBaseUrl}/polls/${this.selectedPoll}/recipients`
        const url = `${this.pollApiBaseUrl}/pollRuns/${this.selectedPollRun.id}/recipients`
        const res = await this.$lx.executeParentOriginXHR('GET', url)
          .then(({ body }) => JSON.parse(body).data)
        this.pollRunFactSheetScope = res
      } finally {
        this.queryCount--
      }
    },
    async getPollRunResults () {
      this.queryCount++
      try {
        // const url = `${this.pollApiBaseUrl}/polls/${this.selectedPoll}/recipients`
        const url = `${this.pollApiBaseUrl}/pollRuns/${this.selectedPollRun.id}/pollResults`
        const res = await this.$lx.executeParentOriginXHR('GET', url)
          .then(({ body }) => JSON.parse(body).data)
        this.pollRunResults = res
      } finally {
        this.queryCount--
      }
    },
    getQuestionResults (questionId) {
      // let { type = null, options = [] } = this.questionIndex[questionId] || {}
      // if (type === null) return
      let result = this.scoredQuestionIndex[questionId] || null
      if (result === null) return
      result = result.filter(({ factSheetId }) => this.selectedFactSheetIndex[factSheetId])
      /*
      if (type === 'radio') {
        options = options.reduce((accumulator, option) => ({ ...accumulator, [option.label]: 0 }), {})
        result.forEach(response => {
          const { answer } = response
          options[answer]++
        })
        return options
      }
      */
      // textarea, date number
      result = result.reduce((accumulator, { answer, userId, factSheetId }) => {
        accumulator.push({ answer, userId, factSheetId })
        return accumulator
      }, [])
      return result
    },
    setSelectedRecipientsFromFactSheetSelection () {
      const selectedRecipients = Array.from(this.pollRunFactSheetScope.factSheets
        .filter(({ factSheet }) => this.selectedFactSheetIndex[factSheet.id])
        .reduce((accumulator, { recipients }) => {
          recipients.forEach(({ id }) => accumulator.add(id))
          return accumulator
        }, new Set()))
      this.selectedRecipientIndex = selectedRecipients
        .reduce((accumulator, recipientId) => ({ ...accumulator, [recipientId]: true }), {})
    },
    toggleFactSheetSelection (factSheetId) {
      this.selectedFactSheetIndex[factSheetId]
        ? this.$delete(this.selectedFactSheetIndex, factSheetId)
        : this.$set(this.selectedFactSheetIndex, factSheetId, true)
      this.setSelectedRecipientsFromFactSheetSelection()
    },
    toggleAllFactSheetSelection () {
      const { factSheets } = this.pollRunFactSheetScope
      if (Object.keys(this.selectedFactSheetIndex).length) this.selectedFactSheetIndex = {}
      else this.selectedFactSheetIndex = factSheets.reduce((accumulator, { factSheet }) => ({ ...accumulator, [factSheet.id]: true }), {})
      this.setSelectedRecipientsFromFactSheetSelection()
    },
    setSelectedFactSheetsFromRecipientSelection () {
      const selectedFactSheets = Array.from(this.pollRunFactSheetScope.recipients
        .filter(({ recipient }) => this.selectedRecipientIndex[recipient.id])
        .reduce((accumulator, { factSheets }) => {
          factSheets.forEach(({ id }) => accumulator.add(id))
          return accumulator
        }, new Set()))
      this.selectedFactSheetIndex = selectedFactSheets
        .reduce((accumulator, factSheetId) => ({ ...accumulator, [factSheetId]: true }), {})
    },
    toggleRecipientSelection (recipientId) {
      this.selectedRecipientIndex[recipientId]
        ? this.$delete(this.selectedRecipientIndex, recipientId)
        : this.$set(this.selectedRecipientIndex, recipientId, true)
      this.setSelectedFactSheetsFromRecipientSelection()
    },
    toggleAllRecipientsSelection () {
      const { recipients } = this.pollRunFactSheetScope
      if (Object.keys(this.selectedRecipientIndex).length) this.selectedRecipientIndex = {}
      else this.selectedRecipientIndex = recipients.reduce((accumulator, { recipient }) => ({ ...accumulator, [recipient.id]: true }), {})
      this.setSelectedFactSheetsFromRecipientSelection()
    },
    previewFactSheet (factSheet) {
      const { type, id } = factSheet
      this.$lx.openLink(`${this.baseUrl}/factsheet/${type}/${id}`)
    }
  },
  watch: {
    queryCount (count, oldCount) {
      const started = !oldCount && !!count
      const ended = !count && !!oldCount
      if (started) this.$lx.showSpinner()
      else if (ended) this.$lx.hideSpinner()
    },
    selectedPoll (poll) {
      this.pollRuns = []
      this.selectedPollRun = null
      this.pollRunFactSheetScope = null
      this.pollRunResults = null
      if (poll) this.getPollRuns()
    },
    selectedPollRun (pollRunId) {
      if (pollRunId) {
        this.getPollRunFactSheetScope()
        this.getPollRunResults()
      } else {
        this.pollRunResults = null
        this.pollRunFactSheetScope = null
      }
    },
    pollRunFactSheets (pollRunFactSheets) {
      const { selectedFactSheetIndex, selectedRecipientIndex } = pollRunFactSheets
        .reduce((accumulator, { factSheet, recipients }) => {
          accumulator.selectedFactSheetIndex[factSheet.id] = true
          recipients.forEach(({ id }) => { accumulator.selectedRecipientIndex[id] = true })
          return accumulator
        }, { selectedFactSheetIndex: {}, selectedRecipientIndex: {} })
      this.selectedFactSheetIndex = selectedFactSheetIndex
      this.selectedRecipientIndex = selectedRecipientIndex
    }
  },
  computed: {
    questionnaire () {
      return this.selectedPoll ? this.selectedPoll.questionnaire : {}
    },
    questions () {
      const { questions = [] } = this.questionnaire
      return questions
    },
    questionIndex () {
      const flatQuestions = (questions = [], acc = []) => {
        for (const question of questions) {
          const { type, children } = question
          if (type === 'group') acc = acc.concat(...flatQuestions(children))
          else acc.push(question)
        }
        return acc
      }

      const flattedQuestions = flatQuestions(this.questions)
      const questionIndex = flattedQuestions
        .reduce((accumulator, question) => {
          accumulator[question.id] = question
          return accumulator
        }, {})
      return questionIndex
    },
    scoredQuestionIndex () {
      const scoredQuestionIndex = (this.pollRunResults || [])
        .reduce((accumulator, result) => {
          const { users = [], factSheet = {}, answers = [] } = result
          const { id: userId } = users[0]
          const { id: factSheetId } = factSheet
          for (const answer of answers) {
            const { questionId, answer: ans } = answer
            const question = this.questionIndex[questionId]
            if (!question) continue
            if (!accumulator[questionId]) accumulator[questionId] = []
            accumulator[questionId].push({
              answer: ans,
              userId,
              factSheetId
            })
          }
          return accumulator
        }, {})
      return scoredQuestionIndex
    },
    pollRunFactSheets () {
      return this.pollRunFactSheetScope
        ? this.pollRunFactSheetScope.factSheets
        : []
    },
    pollRunRecipients () {
      return this.pollRunFactSheetScope
        ? this.pollRunFactSheetScope.recipients
        : []
    },
    pollResultsIndex () {
      return (this.pollRunResults || [])
        .reduce((accumulator, result) => {
          const { answers, users, factSheet } = result
          const { id: factSheetId } = factSheet
          const { id: userId, email, fullName } = users[0]
          if (!accumulator.factSheets[factSheetId]) accumulator.factSheets[factSheetId] = {}
          if (!accumulator.recipients[userId]) accumulator.recipients[userId] = {}
          accumulator.factSheets[factSheetId][userId] = { userId, email, fullName, factSheetId, answers }
          accumulator.recipients[userId][factSheetId] = { userId, email, fullName, factSheetId, answers }
          return accumulator
        }, { factSheets: {}, recipients: {} })
    },
    allFactSheetsSelected () {
      const allFactSheets = ((this.pollRunFactSheetScope || {}).factSheets || [])
        .reduce((accumulator, { factSheet }) => {
          accumulator.add(factSheet.id)
          return accumulator
        }, new Set())
      const selectedFactSheets = new Set(Object.keys(this.selectedFactSheetIndex))
      const difference = new Set(
        [...allFactSheets].filter(x => !selectedFactSheets.has(x)))
      const noneSelected = difference.size === allFactSheets.size
      const someSelected = !!difference.size && difference.size !== allFactSheets.size
      const allSelected = !difference.size && !!allFactSheets.size
      return noneSelected
        ? false
        : someSelected
          ? null
          : allSelected
    },
    allRecipientsSelected () {
      const allRecipients = ((this.pollRunFactSheetScope || {}).recipients || [])
        .reduce((accumulator, { recipient }) => {
          accumulator.add(recipient.id)
          return accumulator
        }, new Set())
      const selectedRecipients = new Set(Object.keys(this.selectedRecipientIndex))
      const difference = new Set(
        [...allRecipients].filter(x => !selectedRecipients.has(x)))
      const noneSelected = difference.size === allRecipients.size
      const someSelected = !!difference.size && difference.size !== allRecipients.size
      const allSelected = !difference.size && !!allRecipients.size
      return noneSelected
        ? false
        : someSelected
          ? null
          : allSelected
    }
  },
  async created () {
    const setup = await this.$lx.init()
    const { settings } = setup
    const { baseUrl } = settings
    this.baseUrl = baseUrl
    this.pollApiBaseUrl = new URL(baseUrl).origin + '/services/poll/v2'
    this.getPolls()
  }
}
</script>
