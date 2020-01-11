<template>
    <!-- Modal -->
    <div id="modal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="model-title" v-if="day">{{ day[0].toUpperCase() + day.slice(1) }}, {{ month }} {{ date }}</h4>
                </div>

                <div class="container-fluid modal-body">
                    <h4>Events</h4>
                    <div class="row" id="events">
                        <p v-if="events !== undefined && events.length === 0">You have no events yet for this date</p>
                        <transition-group name="fade" mode="out-in">
                            <Event v-for="(event, index) in events" :key="index" :el="index" :color="event.color" :text="event.data" :eventId="event._id" v-on:save="$emit('save')" v-on:deleted="deleteEvent" />
                        </transition-group>
                    </div>
                </div>

                <div class="modal-footer">
                    <small class="hidden-xs">Select a color then click "Add New" button</small>
                    <button type="button" class="btn btn-default pull-right hidden-xs" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success pull-right" @click="newEvent" id="add">Add New</button>
                    <select class="input-default pull-right" id="color" @change="selectColor">
                        <option value="white">Select Color</option>
                        <option v-for="(hex, color) in colors" :key="hex" :value="hex">{{ color }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Event from "./Event";

    export default {
        name: "modal",
        components: {
          Event
        },
        props: {
            date: Number,
            id: String,
            day: String,
            month: String,
            colors: Object,
            events: Array,
        },
        data() {
            return {
                selectedColor: 'white',
            }
        },
        methods: {
            // Create new event element
            newEvent() {
                this.events.push({
                    color: this.selectedColor,
                    text: '',
                });
            },

            // Change selected color based on user's input
            selectColor() {
                this.selectedColor = document.getElementById('color').value;
            },

            // Delete an event
            deleteEvent(eventId) {
                this.$emit('delete', eventId);
            }
        }
    }
</script>

<style scoped>
    .model-title {
        text-align: left;
    }
    .modal-body {
        width: 80%;
    }
    .btn {
        font-weight: bold;
    }
    .ta {
        width: 100%;
        resize: none;
        margin-top: 30px;
    }
    select {
        box-shadow: 0 2px 4px 0 rgba(38, 38, 38, 0.15);
        width: 130px;
        height: 34px;
    }
    .event {
        border: 1px solid red;
    }
    .pull-right {
        margin-right: 10px;
    }
    small {
        margin-right: 15px;
    }
</style>