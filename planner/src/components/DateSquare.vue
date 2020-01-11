<template>
    <transition name="fade" mode="out-in">
        <div :class="classes + ' ' + day" :id="id" @mouseenter="enter(id)" @mouseleave="leave(id)" @click="$emit('dateClicked', {id: id, day: day, date: date})" v-if="date" data-toggle="modal" data-target="#modal" data-keyboard="true">
            <strong class="date highlight" :key="date" v-if="date === today && highlight">{{ date }}</strong>
            <strong class="date" :key="date" v-else>{{ date }}</strong>
            <div class="day-container" v-if="events" >
                <div class="row" v-for="(event, index) in events" :key="index">
                    <div v-if="event['date'] === id" class="col-xs-12 event" :style="{background: event.color, color: 'black'}">{{ event.data }}</div>
                </div>
            </div>
        </div>
        <div v-else :class="classes + ' gray-out hidden-xs hidden-sm'"></div>
    </transition>
</template>

<script>
    export default {
        name: 'DateSquare',
        props: {
            date: [Number, String],
            day: String,
            id: String,
            today: Number,
            highlight: Boolean,
            events: [Object, Array]
        },
        data() {
            return {
                classes: 'square col-md-2',
            }
        },
        methods: {
            // Manually add element hover properties based on generated ID
            enter(id) {
                if (document.getElementById(id)) {
                    document.getElementById(id).classList.add('hover');
                    document.getElementById(id).style.cursor = "pointer";
                }
            },

            // Manually remove element hover properties based on generated ID
            leave(id) {
                document.getElementById(id).classList.remove('hover');
            },

            // Adjust weekend/disabled date square divs accordingly
            fixSizes() {
                // Get weekends and empty squares
                let saturdays = document.getElementsByClassName('saturday');
                let sundays = document.getElementsByClassName('sunday');
                let grayedOut = document.getElementsByClassName('gray-out');

                // Fix div sizing for saturdays
                for (let i = 0; i < saturdays.length; i++) {
                    saturdays[i].classList.remove('col-md-2');
                    saturdays[i].classList.add('col-lg-1');
                }

                // Fix div sizing for sundays
                for (let i = 0; i < sundays.length; i++) {
                    sundays[i].classList.remove('col-md-2');
                    sundays[i].classList.add('col-md-1');
                }

                // Fix div sizing for sundays that are grayed-out
                if (grayedOut.length > 0) {
                    grayedOut[0].classList.remove('col-md-2');
                    grayedOut[0].classList.add('col-md-1');
                }

                // Remove any cursor style artifacts
                for (let i = 0; i < grayedOut.length; i++) {
                    grayedOut[i].style.removeProperty('cursor');
                }
            },
        },
        mounted() {
            this.fixSizes();
        },
        updated() {
            this.fixSizes();
        },
        watch: {
            date: function () {
                this.fixSizes();
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .square {
       border-right: 1px solid #dadce0;
        border-bottom: 1px solid #dadce0;
        box-shadow: 0 2px 2px 0 rgba(38, 38, 38, 0.07);
        height: 280px;
        text-align: center;
        padding: 20px;
        background: #ffffff;
        overflow: auto;
    }
    .date {
        font-size: larger;
    }
    .hover {
        background: #f8f8f8 !important;
    }
    .gray-out {
        background: #fbfbfb;
    }
    .saturday, .sunday {
        background: #fbfbfb;
    }
    .highlight {
        background: rgba(51,122,183,0.73);
        border-radius: 20px;
        padding: 5px;
        color: #fff;
    }
    .day-container {
        margin-top: 20px;
        padding: 10px;
    }
    .event {
        margin-bottom: 10px;
        padding: 5px 1px;
    }
</style>
