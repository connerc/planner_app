<template>
    <div id="app" class="container-fluid">
        <div id="calendar">
            <Month :current-month="targetMonthName" :selectedMonth="targetMonthNum" :currentYear="this.currentYear" :targetYear="targetYear" :months="monthNames" :colors="colors" :labels="colorLegend"
                   v-on:next="next" v-on:prev="prev" v-on:changeMonth="changeMonth" v-on:changeYear="changeYear" v-on:today="today" v-on:save="saveLegend" />

            <DaysRow :days="dayNames" />

            <div class="row" id="calendar-body">
                <transition-group name="list">
                    <Square v-for="(date, index) in dates" :key="index" v-on:dateClicked="buildModal" :date="date" :day="getDay(date)" :id="formatDate(date)" :today="currentDate" :highlight="highlight" :events="events" />
                </transition-group>
            </div>
        </div>

        <Modal v-bind="modalData" :colors="colors" v-on:save="saveEvents" v-on:delete="deleteEvent" />
    </div>
</template>

<script>
    import Square from './components/DateSquare.vue'
    import DaysRow from "./components/DaysRow";
    import Month from "./components/Month";
    import Modal from "./components/Modal";

    export default {
        name: 'app',
        components: {
            Modal,
            Square,
            DaysRow,
            Month
        },
        data(){
            return {
                // Initialize these to be watched for changes
                dates: [],
                targetMonthNum: 0,
                targetMonthName: '',
                targetYear: 0,
                currentDate: 0,
                highlight: false,
                modalData: {},
                events: [],
                colorLegend: [],

                // Hardcoded data
                url: 'http://localhost:3000/api/', // TODO: Update with live URL

                monthNames: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],

                dayNames: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ],

                // Available event label colors
                colors: {
                    Red: '#f2dede',
                    Blue: '#d9edf7',
                    Yellow: '#fcf8e3',
                    Green: '#dff0d8',
                    Purple: '#D3B3EC',
                    Orange: '#ECD3B3'
                },
            }
        },
        methods: {
            // Determine day of the week for a given date
            getDay(date) {
                let month = this.targetMonthNum + 1; // Add 1 month for feeding in date correctly
                let day = this.dayNames[this.moment(this.targetYear + '-' + ("0" + month).slice(-2) + '-' + ("0" + date).slice(-2), 'YYYY-MM-DD').day()];

                if (day) {
                    return day.toLowerCase();
                }
                else {
                    return '';
                }
            },

            // Format a full date stamp
            formatDate(date) {
                return this.targetYear + '-' + ("0" + (this.targetMonthNum + 1)).slice(-2) + '-' + ("0" + date).slice(-2);
            },

            // Build our calendar for a given month and year
            async generateCalendar() {
                this.targetMonthName = this.monthNames[this.targetMonthNum];

                // Add 1 month for feeding in date correctly
                let month = this.targetMonthNum + 1;

                // Determine how many days in the month, and what day the first day of the month falls on
                let numOfDays = this.moment(this.targetYear + '-' + ("0" + month).slice(-2), 'YYYY-MM').daysInMonth();
                let dayOfWeek = this.moment(this.targetYear + '-' + ("0" + month).slice(-2) + '-01', 'YYYY-MM-DD').day();

                this.dates.length = 0;
                // Create list of dates
                for (let i = 1; i <= numOfDays; i++) {
                    this.dates.push(i);
                }

                // Push empty dates to beginning of dates array to start the month on correct day
                for (let i = 0; i < dayOfWeek; i++) {
                    this.dates.unshift('');
                }

                // Handle highlighting today's date
                this.highlight = this.targetYear === this.currentYear && this.currentMonth === this.targetMonthNum;

                // Get all events for days in month
                this.events = await this.getEvents(month, this.targetYear);
            },

            // Change to next month
            next() {
                if (this.targetMonthNum !== 11) {
                    this.targetMonthNum++;
                }
                else {
                    this.targetMonthNum = 0;
                    this.targetYear++;
                }
            },

            // Change to previous month
            prev() {
                if (this.targetMonthNum !== 0) {
                    this.targetMonthNum--;
                }
                else {
                    this.targetMonthNum = 11;
                    this.targetYear--;
                }
            },

            // Change month based on month select input
            changeMonth() {
                let selectedMonth = document.getElementById('months-select').value;
                this.targetMonthNum = selectedMonth - 1;
            },

            // Change year based on year select input
            changeYear() {
                this.targetYear = parseInt(document.getElementById('year-select').value);
            },

            // Go to current month/year
            async today() {
                this.targetYear = this.currentYear;
                this.targetMonthNum = this.currentMonth;

                // After calendar has rendered for current month/year, open modal for today's date
                setTimeout(() => document.getElementById(this.formatDate(this.currentDate)).click(), 300);
            },

            // Build our modal's data object from data emitted in DateSquare when clicked
            buildModal(data) {
                // Structure the data emitted from child component
                this.modalData.month = this.targetMonthName;
                for (let key in data) {
                    this.$set(this.modalData, key, data[key]);
                }

                // Filter month's events for our specific day and build new modal eventsArray
                let eventsArray = [];
                for (let i = 0; i < this.events.length; i++) {
                    if (this.events[i].date === data.id) {
                        eventsArray.push(this.events[i]);
                    }
                }

                // Set model's events
                this.$set(this.modalData, 'events', eventsArray);
            },

            // Get events for a given date from API
            getEvents(month, year) {
                let user = 0; // TODO: Feed userID from session
                return fetch(this.url + 'get-events/' + user + '/' + ("0" + month).slice(-2) + '/' + year)
                    .then(response => response.json());
            },

            // Update a date's events
            async saveEvents() {
                let user = 0; // TODO: Feed userID from session
                for (let i = 0; i < this.modalData.events.length; i++) {
                    if (this.modalData.events[i]._id !== undefined) {
                        // Update an existing event
                        fetch(this.url + 'update-event/', {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: this.modalData.events[i]._id,
                                data: document.getElementById(i + '-input').value
                            })
                        });

                        // Refresh calendar with update
                        this.$set(this.modalData.events[i], 'data', document.getElementById(i + '-input').value);
                        this.$set(this.modalData.events[i], '_id', this.modalData.events[i]._id);

                        for (let x = 0; x < this.events.length; x++) {
                            if (this.events[x]._id === this.modalData.events[i]._id) {
                                this.$set(this.events[x], 'data', this.modalData.events[i].data);
                                break;
                            }
                        }
                    }
                    else {
                        // Add new event
                        let newID = await fetch(this.url + 'add-event/', {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                user: user,
                                date: this.modalData.id,
                                color: this.modalData.events[i].color,
                                data: document.getElementById(i + '-input').value
                            })
                        }).then(response => response.json());

                        // Refresh calendar with new events
                        this.events.push({
                            _id: newID,
                            user: user,
                            date: this.modalData.id,
                            color: this.modalData.events[i].color,
                            data: document.getElementById(i + '-input').value
                        });

                        // Add newID to the modal events
                        this.$set(this.modalData.events[i], '_id', newID);
                    }

                    console.log('Events saved');
                }
            },

            // Delete an event
            deleteEvent(eventId) {
                let user = 0; // TODO: Feed userID from session
                fetch(this.url + 'delete-event/', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: eventId,
                        user: user
                    })
                });

              // Remove from events list to reflect on calendar
              for (let i = 0; i < this.events.length; i++) {
                  if (this.events[i]._id === eventId) {
                      this.events.splice(i, 1);
                      break;
                  }
              }
            },

            // Get color labels for color legend
            getColorLegend() {
                let user = 0; // TODO: Feed userID from session
                return fetch(this.url + 'get-colors/' + user)
                    .then(response => response.json());
            },

            // Save changes to color legend
            async saveLegend() {
                let user = 0; // TODO: Feed userID from session

                for (let key in this.colors) {
                    let label = document.getElementById(key).value;
                    // Check database for existing record for this label
                    let existingRecord = await fetch(this.url + 'get-color/' + user + '/' + key.toLowerCase())
                    .then(response => response.json());

                    if (existingRecord !== null) {
                        // Update existing record with new label value
                        fetch(this.url + 'update-color/', {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: existingRecord._id,
                                label: label
                            })
                        });
                    }
                    else {
                        // Create a new record with new label value
                        if (label !== '') {
                            fetch(this.url + 'add-color/', {
                                method: 'POST',
                                mode: 'cors',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    user: user,
                                    color: key.toLowerCase(),
                                    label: label
                                })
                            });
                        }
                    }
                }

                console.log('Color Legend saved');
            }
        },
        async beforeMount() {
            // TODO: User authentication

            // Months are 0-based
            this.moment = require('moment');

            // Get today's date
            this.currentDate = this.moment().date();
            this.currentMonth = this.moment().month();
            this.currentYear = this.moment().year();

            // Use today's date as current target default
            this.targetMonthNum = this.currentMonth; // 0 based
            this.targetYear = this.currentYear;

            // Get colors legend data from database
            this.colorLegend = await this.getColorLegend();

            // Build calendar for current month upon app load
            this.generateCalendar();
        },
        watch: {
            // Rebuild our calendar upon these data changes
            targetMonthNum: function() {
                this.generateCalendar();
            },
            targetYear: function() {
                this.generateCalendar();
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
    }
    #calendar-body {
        background: #fbfbfb;
    }

    /* Transitions */
    .list-enter-active, .list-leave-active {
        transition: opacity 1s;
    }
    .list-enter, .list-leave-to {
        opacity: 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
