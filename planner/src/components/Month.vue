<template>
    <div class="row" id="month-row">
        <button class="btn btn-default pull-left hidden-xs hidden-sm" @click="$emit('today')"><strong>Today</strong></button>

        <select class="input-default pull-left hidden-xs hidden-sm" @change="$emit('changeMonth')" id="months-select">
            <option v-for="(month, index) in months" :value="index + 1" :key="index" :selected="index === selectedMonth">
                {{ month }}
            </option>
        </select>

        <select class="input-default pull-left hidden-xs hidden-sm" @change="$emit('changeYear')" id="year-select">
            <option :value="prevYear">{{ prevYear }}</option>
            <option :value="currentYear" :selected="currentYear === targetYear">{{ currentYear }}</option>
            <option :value="nextYear">{{ nextYear }}</option>
        </select>

        <transition name="fade" mode="out-in">
            <strong id="current-month" :key="currentMonth">{{ currentMonth }} {{ targetYear }}</strong>
        </transition>

        <button class="btn btn-primary pull-right" @click="$emit('next')"><strong>Next</strong></button>
        <button class="btn btn-primary pull-right" @click="$emit('prev')"><strong>Prev</strong></button>

        <Legend :colors="colors" :labels="labels" v-on:save="$emit('save')" />
    </div>
</template>

<script>
    import Legend from "./Legend";

    export default {
        name: 'Month',
        components: {
          Legend
        },
        props: {
            months: Array,
            currentMonth: String,
            currentYear: Number,
            selectedMonth: Number,
            targetYear: Number,
            colors: Object,
            labels: Array
        },
        data() {
            return {
                prevYear: this.currentYear - 1,
                nextYear: this.currentYear + 1
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #month-row {
        padding: 20px 40px;
    }
    #current-month {
        font-size: xx-large;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.11);
    }
    .btn, select {
        margin-left: 10px;
        box-shadow: 0 2px 4px 0 rgba(38, 38, 38, 0.15);
    }
    select {
        margin-left: 20px;
        width: 130px;
        height: 34px;
    }
</style>
