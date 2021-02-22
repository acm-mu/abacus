import React, { useState, useEffect } from 'react'
import '@toast-ui/chart/dist/toastui-chart.min.css'
import { LineChart, PieChart } from '@toast-ui/react-chart'
import { Block } from '../../components'
import { SubmissionType, ProblemType } from '../../types'
import config from '../../environment'



const Home = (): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [submissions, setSubmissions] = useState<SubmissionType[]>([])
  const [problems, setProblems] = useState<ProblemType[]>([])
  const [isMounted, setMounted] = useState<boolean>(false)

  let startTime = 0; 
  let endTime;

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
          startTime = data.start_time
          endTime = data.end_time
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

  let accepted = 0;
  let rejected = 0;
  let pending = 0;
  let other = 0;

  const problem0 = [];
  const problem1 = [];
  const problem2 = [];
  const problem3 = [];

  submissions.forEach((sub: { status: any, date: any, problem_id: any }) => {
    switch(sub.status) {
      case 'accepted':
        accepted++;
        break;
      case 'rejected':
        rejected++;
        break;
      case 'pending':
        pending++;
        break;
      default:
        other++;
        break;
    }

    

  });

  const problemNames: string[] = [];
  problems.forEach((problem: {problem_name : string}) => {
    problemNames.push(problem.problem_name);
  });

  const hour0 = startTime;
  const hour05 = startTime + 1800;
  const hour10 = hour05 + 1800;
  const hour15 = hour10 + 1800;
  const hour20 = hour15 + 1800;
  const hour25 = hour20 + 1800;
  const hour30 = hour25 + 1800;
  
  const breakdownData = {
    categories: ['Submission Status'],
    series: [
      {
          name: 'Accepted',
          data: accepted
      },
      {
          name: 'Rejected',
          data: rejected
      },
      {
        name: 'Pending',
        data: pending
      },
      {
        name: 'Other',
        data: other
      }
  ]
  };

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
    series: [
      {
        name: problemNames[0],
        data: [40, 65, 20, 21, 19, 18, 41],
        
      },
      {
        name: problemNames[1],
        data: [5, 30, 21, 18, 59, 50, 28],
      },
      {
        name: problemNames[2],
        data: [30, 5, 18, 21, 33, 41, 29],
      },
    ],
  };
  
  const breakdownOptions = {
    theme: {
      series: {
        colors: ['#83cd64', '#db2828', '#cccccc', '#aaaaaa']
      }
    },
    chart: {
          width: '100%',
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
      }
  };

  const timelineOptions = {
    chart: {
      width: '100%',
      height: 450,
      animation: true
    },
    series: {
      stack: {
        type: 'normal'
      },
      selectable: true,
      zoomable: true,
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
      <h2>Submission Breakdown</h2>
      <PieChart
        data={breakdownData} 
        options={breakdownOptions} 
      />
    </Block>

    <Block size='xs-6'>
      <h2>Submission Timeline</h2>
      <LineChart
        data={timelineData}
        options={timelineOptions}
      />
    </Block>
  </>
)
}
export default Home