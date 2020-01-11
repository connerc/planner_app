<template>
    <div class="row hidden-xs hidden-sm" id="days-row">
        <div class="col-md-1">{{ days[0] }}</div>
        <div class="col-md-2">{{ days[1] }}</div>
        <div class="col-md-2">{{ days[2] }}</div>
        <div class="col-md-2">{{ days[3] }}</div>
        <div class="col-md-2">{{ days[4] }}</div>
        <div class="col-md-2">{{ days[5] }}</div>
        <div class="col-md-1">{{ days[6] }}</div>
    </div>
</template>

<script>
    export default {
        name: 'DatesRow',
        props: {
            days: Array
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #days-row {
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #dadce0;
        border-top: 1px solid #dadce0;
        box-shadow: 0 2px 4px 0 rgba(38, 38, 38, 0.07);
    }
</style>
