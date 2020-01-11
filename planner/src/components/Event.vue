<template>
    <div class="row" :id="el">
        <div class="col-sm-11 label" :style="{background: color, color: 'black'}">
            <input type="text" :id="el + '-input'" :style="{background: color}" @blur="$emit('save')" placeholder="Enter event details here" :value="inputText" @change="changeValue(el + '-input')" />
        </div>

        <div class="col-sm-1">
            <i class="fa fa-trash-alt hidden-xs" title="Delete" @click="remove(el, eventId)" />
        </div>
    </div>
</template>

<script>
    export default {
        name: "Event",
        props: {
            color: String,
            el: Number,
            text: String,
            eventId: String
        },
        data() {
            return {
                inputText: this.text // So we don't mutate the prop directly
            }
        },
        methods: {
            // Emit event to parent to remove event from array
            remove(id, eventId) {
                document.getElementById(id).remove();
                this.$emit('deleted', eventId);
            },

            // Change input value based on user's input
            changeValue(id) {
                //this.inputText = document.getElementById(id).value;
                this.$set(this, 'inputText', document.getElementById(id).value);
            }
        },
        updated() {
            // Keep our events displaying correct text
            if (this.text !== '' && this.inputText === '') {
                this.$set(this, 'inputText', this.text);
            }
        }
    }
</script>

<style scoped>
    div {
        padding: 10px;
        font-size: small;
    }
    input {
        width: 100%;
        border: none;
    }
    input:focus {
        outline: none;
    }
    i {
        font-size: large;
        cursor: pointer;
        color: #cccccc;;
    }
    i:hover, i:focus {
        color: #2c3e50;
    }
</style>