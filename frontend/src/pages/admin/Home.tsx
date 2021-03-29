
import { Problem, Submission } from 'abacus'
import React, { useContext, useEffect, useState } from 'react'
import { LineChart, PieChart } from '@toast-ui/react-chart'
import AppContext from 'AppContext'
import { Block } from 'components'
import config from 'environment'
import '@toast-ui/chart/dist/toastui-chart.min.css'
import { Helmet } from 'react-helmet'

const Home = (): JSX.Element => {
  const [submissions, setSubmissions] = useState<Submission[]>()
  const [problems, setProblems] = useState<Problem[]>([])
  const [isMounted, setMounted] = useState(true)

  const { settings } = useContext(AppContext)

  const fetchData = async () => {
    let response = await fetch(`${config.API_URL}/submissions`, { headers: { Authorization: `Bearer ${localStorage.accessToken}` } })
    let submissions = Object.values(await response.json()) as Submission[]

    submissions = submissions.filter((submission: Submission) => submission.date > Number(settings?.start_date) && submission.date < Number(settings?.end_date))

    response = await fetch(`${config.API_URL}/problems?division=blue`, { headers: { Authorization: `Bearer ${localStorage.accessToken}` } })
    let problems = await response.json()
    if (problems.length)
      problems = problems.sort((a: Problem, b: Problem) => a.pid.localeCompare(b.pid))

    if (isMounted) {
      setSubmissions(submissions)
      setProblems(Object.values(problems))
    }
  }

  useEffect(() => {
    fetchData()
    const updateInterval = setInterval(fetchData, 5 * 60 * 1000);
    return () => {
      setMounted(false)
      clearInterval(updateInterval)
    }
  }, []);

  const statuses: { [key: string]: { name: string, data: number } } = {};

  const timeSubmissions = Object.assign({}, ...problems.map((problem: Problem) => ({
    [problem.pid]: {
      data: [0, 0, 0, 0, 0, 0],
      name: problem.name
    }
  })));

  submissions?.forEach((sub: Submission) => {
    if (sub.problem) {
      const startDate = Number(settings?.start_date) || 0
      const timeBin = Math.floor((sub.date - startDate) / (1800));
      timeSubmissions[sub.problem.id].data[timeBin]++;

      statuses[sub.status] == undefined ? statuses[sub.status] = { name: sub.status, data: 1 } : statuses[sub.status].data++;
    }
  });

  const breakdownData = {
    categories: ['Submission Status'],
    series: Object.values(statuses)
  };

  const timelineData = {
    categories: [
      '9:00 AM',
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
      eventDetectType: 'grouped',
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

  return <>
    <Helmet> <title>Abacus | Admin</title> </Helmet>
    <Block size='xs-12'>
      <h1>Admin Dashboard</h1>
    </Block>

    <Block size='xs-6'>
      <h2>Submission Timeline</h2>
      {submissions?.length ?
        <LineChart
          data={timelineData}
          options={timelineOptions}
        />
        : <p>There are not any submissions yet!</p>}
    </Block>

    <Block size='xs-6'>
      <h2>Submission Breakdown</h2>
      {submissions?.length ?

        <PieChart
          data={breakdownData}
          options={breakdownOptions}
        />
        : <p>There are not any submissions yet!</p>}
    </Block>
  </>
}
export default Home