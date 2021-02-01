import React, { useState } from 'react'
import MarkdownView from 'react-showdown'
import { Block } from '../../components'

const Problem = (): JSX.Element => {
  const [problem] = useState({
    id: '',
    problem_name: '',
    description: '',
    cpu_time_limit: 0,
    memory_limit: 0
  })
  
  return (
    <>
    <Block size='xs-9'>
    <h1>Problem { problem.id }
    <br /> 
    {problem.problem_name }</h1>
    <hr />

    <MarkdownView markdown={problem.description} />
  </Block>
  <Block size='xs-3'>
    <div style={{display: 'flex', justifyContent: 'space-evenly'}} >
      {/* <a 
      {% if submissions['status'] == "accepted" or submissions['status'] == "pending" or not(is_logged_in()) %}
      class="icon button ui disabled"
      {% else %}
      href="/gold/problems/{{ problem.id }}/submit"  id="submit" class = "icon button ui"
      {% endif %} 
      data-tooltip="Submit" data-position="top center" data-inverted="">
        <i class="upload icon"></i>
        Submit
      </a> */}
      {/* <a class="icon button ui" id="stats" data-tooltip="Stats" data-position="top center" data-inverted="">
        <i class="chart bar icon"></i>
        Stats
      </a> */}
    </div>
    <p><b>Problem ID:</b> {problem.id }</p>
    <p><b>CPU Time limit:</b> { problem.cpu_time_limit }</p>
    <p><b>Memory limit:</b> { problem.memory_limit }</p>
    <p><b>Download:</b> <a>Sample data files</a></p>
  </Block>
  </>
  )
}

export default Problem