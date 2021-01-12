interface Point {
  x: number;
  y: number;
}

Component({
  selector: 'app-temp-chart-example',
  template: `
    <div class="chart-wrapper">
      <canvas #chartRef></canvas>
    </div>
  `,
})
export class TempChartExampleComponent implements AfterVewInit {
  @ViewChild('chartRef', { static: true }) chartRef: ElementRef;

  private mousePosition: Point = {
    x: 0,
    y: 0
  };

  constructor() {}

  public ngAfterViewInit(): void {
    if (this.chartRef.nativeElement) {
      this.initChart();
    }
  }

  private initChart(): void {
    var that = this;

    Chart.defaults.LineWithLine = Chart.defaults.line;

    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
      draw: function(ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);

        that.drawLine(this.chart.ctx, that.mousePosition.x, that.mousePosition.y, this.chart.legend.bottom, this.chart.chartArea.bottom);
        
        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
          this.chart.tooltip._active.forEach(point => {
            that.drawIntersectionPoints(this.chart.ctx, point._model.x, point._model.y, 4)
          });
        }
      }
    });

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: "LineWithLine",
      data: {
        labels: this.getChartLabels(),
        datasets: this.getDatasets(),
      },
      options: this.getChartOptions()
    });

    this.chartRef.nativeElement.addEventListener('touchstart', (evt: TouchEvent) => {
      if (evt.touches.length) {
        this.mousePosition.x = evt.touches[0].clientX;
        this.mousePosition.y = evt.touches[0].clientY;
      }
    });
    this.chartRef.nativeElement.addEventListener('touchmove', (evt: TouchEvent) => {
      if (evt.touches.length) {
        this.mousePosition.x = evt.touches[0].clientX;
        this.mousePosition.y = evt.touches[0].clientY;
      }
    });
  }

  private getChartLabels() {
    return ['a', 'b', 'c', 'd', 'e'];
  }

  private getDatasets() {
    return [
      {
        label: 'first',
        data: [0, 12, 34, 21, 3]
      },
      {
        label: 'second',
        data: [21, 3, 0, 12, 34]
      }
    ];
  }

  private getChartOptions() {
    const options = {
      tooltips: {
        mode: 'x',
        intersect: false,
        callbacks: {
          title: () => "",
        }
      },
      events: [
        'touchstart',
        'touchmove'
      ],
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            display: false
          }
        ]
      }
    };
    return options;    
  }

  private drawLine(canvas, mousePointX: number, mousePointY: number, topY: number, bottomY: number) {
    canvas.save();
    canvas.beginPath();
    canvas.moveTo(mousePointX, topY);
    canvas.lineTo(mousePointX, bottomY);
    canvas.lineWidth = 2;
    canvas.strokeStyle = 'grey';
    canvas.stroke();
    canvas.restore();
  }

  private drawIntersectionPoints(context, centerX: number, centerY: number, radius: number, startAngle: number = 0, endAngle: number = Math.PI*2, color: string = 'red') {
    context.fillStyle = color;
		context.beginPath();
		context.arc(centerX, centerY, radius, startAngle, endAngle, true);
		context.closePath();
		context.fill();
  }
}