import Highcharts from 'highcharts/highstock';

// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
import { useEffect } from 'react';

function Home() {

  const renderChart = async () => {
    const datas = await fetch(
      'https://docs.google.com/spreadsheets/d/12O_YfHPmRHRHeZLRYlHXz-7oWugm8OadVtisvvV94so/gviz/tq?tqx=out:json&tq&gid=69653315'
    ).then(response => response.text()).then((data: any) => {
      // Parse the JSON data
      const json = JSON.parse(data.substring(47, data.length - 2));
      
      // Access the data rows
      const rows = json.table.rows;

      // Do something with the data
      const mapData = rows.map((row: any) => {
        const filtered = row.c.filter((dt: any) => dt && dt?.v !== null)
        const mapValue = filtered.map((dt: any) => {
          return dt.f?.includes('-') ? new Date(dt.f).getTime() : dt.v
        })
        return mapValue
      })
      return mapData
    })

    Exporting(Highcharts);
    // create the chart
    Highcharts.stockChart('charts', {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Stock Price'
        },

        series: [{
            type: 'candlestick',
            name: 'Stock Price',
            data: datas,
            dataGrouping: {
                units: [
                    [
                        'week', // unit name
                        [1] // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]
                ]
            }
        }]
    });
  }

  useEffect(() => {
    renderChart()
  }, [])
  return <div id="charts" className='w-full h-full mt-4 px-4'></div>;
}

export default Home;
