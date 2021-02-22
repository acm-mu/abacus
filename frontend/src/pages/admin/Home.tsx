import React, { useState, useEffect } from 'react'
import '@toast-ui/chart/dist/toastui-chart.min.css'
import { LineChart, PieChart } from '@toast-ui/react-chart'
import { Block } from '../../components'
import { SubmissionType, ProblemType } from '../../types'
import config from '../../environment'
import { start } from 'repl'



const Home = (): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [submissions, setSubmissions] = useState<SubmissionType[]>([])
  const [problems, setProblems] = useState<ProblemType[]>([])
  const [startDate, setStartDate] = useState<number>(0)
  const [isMounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    fetch(`${config.API_URL}/submissions`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const submissions: SubmissionType[] = Object.values(data)
          setSubmissions(Object.values(data))
          setLoading(false)
        }
      })
    fetch(`${config.API_URL}/contest`)
      .then(res => res.json())
      .then(data => {
        if(isMounted) {
          setStartDate(data.start_date)
        }
      })
    fetch(`${config.API_URL}/problems?division=blue`)
      .then(res => res.json())
      .then(data => {
        if(isMounted) {
          const problems: ProblemType[] = Object.values(data)
          problems.sort((a: ProblemType, b: ProblemType) => a.id.localeCompare(b.id))
          setProblems(Object.values(data))
          setLoading(false)
        }
      })
    return () => { setMounted(false) }
  }, [isMounted]);

  const statuses: {[key: string]: {name: string, data: number}} = {};

  const timeSubmissions = Object.assign({}, ...problems.map((problem: ProblemType) => ({
    [problem.id]: {
      data: [0, 0, 0, 0, 0, 0],
      name: problem.problem_name
    } 
  })));
  
  submissions.forEach((sub: { status: string, date: any, problem: any }) => {

    const timeBin = Math.floor((sub.date - startDate)/ (1800));
    timeSubmissions[sub.problem.id].data[timeBin]++;

    statuses[sub.status] == undefined ? statuses[sub.status] = {name: sub.status, data: 1} : statuses[sub.status].data++;
  });

  const hour0 = startDate;
  const hour05 = startDate + 1800;
  const hour10 = hour05 + 1800;
  const hour15 = hour10 + 1800;
  const hour20 = hour15 + 1800;
  const hour25 = hour20 + 1800;
  const hour30 = hour25 + 1800;
  
  const breakdownData = {
    categories: ['Submission Status'],
    series: Object.values(statuses)
  };

  console.log(Object.values(timeSubmissions));

  const timelineData = {
    categories: [
      '9 AM',
      '9:30 AM',
      '10 AM',
      '10:30 AM',
      '11 AM',
      '11:30 AM',
      'Noon'
    ],
    series: Object.values(timeSubmissions)
  };
  
  const breakdownOptions = {
    theme: {
      series: {
        colors: ['#83cd64', '#db2828', '#cccccc', '#aaaaaa']
      }
    },
    chart: {
          width: 'vw',
          height: 450,
          animation: true
    },
    series: {
      selectable: true,
      clockwise: true,
      dataLabels: {
        visible: true,
        anchor: 'outer',
      }
    },
    legend: {
      align: 'bottom',
    }
  };

  const timelineOptions = {
    chart: {
      width: 'vw',
      height: 450,
      animation: true
    },
    series: {
      stack: {
        type: 'normal'
      },
      selectable: true,
      zoomable: true,
    },
    legend: {
      align: 'bottom',
    }
    // chart?: {
    //   // ...
    // },
    // xAxis?: {
    //   // ...
    // },
    // yAxis?: {
    //   // ...
    // },
    // legend?: {
    //   // ...
    // },
    // exportMenu?: {
    //   // ...
    // },
    // tooltip?: {
    //   // ...
    // },
    // plot?: {
    //   // ...
    // },
    // responsive?: {
    //   // ...
    // },
    // theme?: {
    //   // More explanations in the `theme` chapter.
    // },
    // series?: {
    //   showDot?: boolean;
    //   spline?: boolean;
    //   zoomable?: boolean;
    //   eventDetectType?: 'near' | 'nearest' | 'grouped';
    //   shift?: boolean;
    //   stack?: boolean | {
    //     type: 'normal' | 'percent';
    //   }
    //   dataLabels?: {
    //     visible?: boolean;
    //     anchor?: 'center' | 'start' | 'end' | 'auto' | 'outer';
    //     offsetX?: number;
    //     offsetY?: number;
    //     formatter?: (value) => string;
    //   }
    // }
  };

return (
  <>
    <Block size='xs-12'>
      <h1>Admin Dashboard</h1>
    </Block>

    <Block size='xs-6'>
      <h2>Submission Timeline</h2>
      <LineChart
        data={timelineData}
        options={timelineOptions}
      />
    </Block>

    <Block size='xs-6'>
      <h2>Submission Breakdown</h2>
      <PieChart
        data={breakdownData} 
        options={breakdownOptions} 
      />
    </Block>
  </>
)
}
export default Home