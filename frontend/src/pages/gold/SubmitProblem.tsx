import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import { Block } from 'components'

const SubmitProblem = (): JSX.Element => (

  <Block size='xs-12'>
    <Form>
      <Form.Field label='Scratch URL'>
        <Input placeholder="https://scratch.mit.edu/projects/<project_id>" value="{{ scratch_url }}" />
      </Form.Field>
    </Form>
  </Block>
)
{/* <!-- 
    author: {id: 66595561, scratchteam: false, history: {…}, profile: {…}}
    comments_allowed: true
    description: ""
    history: {created: "2020-12-22T02:56:06.000Z", modified: "2020-12-22T02:58:13.000Z", shared: "2020-12-22T02:58:13.000Z"}
    id: 466969373
    image: "https://cdn2.scratch.mit.edu/get_image/project/466969373_480x360.png"
    images: {282x218: "https://cdn2.scratch.mit.edu/get_image/project/466969373_282x218.png?v=1608605893", 216x163: "https://cdn2.scratch.mit.edu/get_image/project/466969373_216x163.png?v=1608605893", 200x200: "https://cdn2.scratch.mit.edu/get_image/project/466969373_200x200.png?v=1608605893", 144x108: "https://cdn2.scratch.mit.edu/get_image/project/466969373_144x108.png?v=1608605893", 135x102: "https://cdn2.scratch.mit.edu/get_image/project/466969373_135x102.png?v=1608605893", …}
    instructions: ""
    is_published: true
    public: true
    remix: {parent: null, root: null}
    stats: {views: 1, loves: 0, favorites: 0, comments: 0, remixes: 0}
    title: "Untitled"
    visibility: "visible"
  --> */}

export default SubmitProblem