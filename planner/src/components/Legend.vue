<template>
    <div class="dropdown pull-right">
        <i class="dropdown-toggle dropdown fa fa-question-circle hidden-xs hidden-sm" data-toggle="dropdown" title="Colors Legend" />

        <ul class="dropdown-menu">
            <li class="dropdown-header">Color Legend</li>
            <li class="divider" />
            <li v-for="(hex, color) in colors" :key="color" class="color-list">
                <span class="dot" :style="{background: hex}" :title="color" />
                <input type="text" maxlength="17" :id="color" placeholder="Add label here" :value="getLabel(color)" @blur="$emit('save')" />
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Legend",
        props: {
            colors: Object,
            labels: Array
        },
        methods: {
            // Assign user's labels to colors
            getLabel(color) {
                for (let i = 0; i < this.labels.length; i++) {
                    if (color === this.labels[i].color.charAt(0).toUpperCase() + this.labels[i].color.slice(1)) {
                        return this.labels[i].label;
                    }
                }
            }
        }
    }
</script>

<style scoped>
    i {
        font-size: x-large;
        margin-right: 10px;
        margin-top: 5px;
        cursor: pointer;
        color: #cccccc;;
    }
    i:hover {
        color: #2c3e50;
    }
    input {
        border: none;
        outline: none;
        width: 159px;
    }
    .dot {
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 10px;
        margin-right: 10px;
        margin-top: 3px;
    }
    ul {
        width: 200px;
        text-align: center;
    }
    .color-list {
        padding: 5px;
    }
    .dropdown-header {
        color: #2b2b2b;
    }
</style>