<template>
  <div>
    <div class="w-min">
      <Calendar />

      <RangeCalendar :number-of-months="2" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Calendar from '../../lib/components/calendar/Calendar.vue'
import RangeCalendar from '../../lib/components/range-calendar/RangeCalendar.vue'
</script>
