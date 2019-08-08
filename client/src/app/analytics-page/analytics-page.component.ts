import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Chart} from "chart.js";
import {AnalyticsPage} from "../shared/layouts/interfaces/interfaces";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain', {static: false}) gainRef: ElementRef
  @ViewChild('order', {static: false}) orderRef: ElementRef

  aSub: Subscription
  average: number
  pending = true


  constructor(private service: AnalyticsService) { }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'

    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'

    }


    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      //**** gain ***//
      // gainConfig.labels.push('08.05.2019')
      // gainConfig.labels.push('15.05.2019')
      // gainConfig.data.push(1500)
      // gainConfig.data.push(2500)
      //**** gain ***//

      //**** Order ***//
      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // orderConfig.labels.push('08.05.2019')
      // orderConfig.labels.push('15.05.2019')
      // orderConfig.data.push(8)
      // orderConfig.data.push(10)
      //**** Order ***//
      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')

      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }


}

function createChartConfig({labels, data, label, color }) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,data,
          borderColor: color,
          steppedLine: false,
          fill: false

        }
      ]
    }
  }
}
