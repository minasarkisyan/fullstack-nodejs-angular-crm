import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Filter} from "../../shared/layouts/interfaces/interfaces";
import {MaterialDatepicker, MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start', {static: false}) startRef: ElementRef
  @ViewChild('end', {static: false}) endRef: ElementRef

  order: number
  start: MaterialDatepicker
  end: MaterialDatepicker
  isValid = true


  ngAfterViewInit(): void {
    this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
  }

  validate() {
    if (!this.start.date || !this.end === null) {
      this.isValid = true
      return
    }

    this.isValid = this.start.date < this.end.date
  }

  ngOnDestroy(): void {
    this.start.destroy()
    this.end.destroy()
  }

  submitFilter() {
    const filter: Filter = {}
    if (this.order) {
      filter.order = this.order
    }

    if (this.start.date) {
      filter.start = this.start.date
    }

    if (this.end.date) {
      filter.end = this.end.date
    }

    this.onFilter.emit(filter)
  }

}
