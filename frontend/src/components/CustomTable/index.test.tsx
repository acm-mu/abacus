import { render, screen } from '@testing-library/react'
import type { IUser } from "abacus"
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import CustomTable from '.'


// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.

/*
uid: string
    role: string
    username: string
    disabled?: boolean
    password: string
    display_name: string
    division?: string
    school?: string
*/
interface UserItem extends IUser {
  checked: boolean
}

it('text renders', () => {
  const { getByText } = render(
    <BrowserRouter>
    <CustomTable<UserItem>
    id={'uid'}
    header={['username', 'role', 'division', 'school', 'display_name']}
    body={[{uid: "12345", role: "team", username: "kevin", display_name: "Greatest team ever", password: "1234", checked: false, division: "blue", school: "Marquette High School"}] as UserItem[]}
    totalPages={2}
    onCheckItem={() => console.log("check item!")}
    sort={{  sortBy: 'username', sortDirection: 'ascending' }}
    onClickHeaderItem={(item) => {console.log(item)}}
    onCheckAll={()=> console.log('clicked all!')}
    onPageChange={() => console.log('page changed')}
  />
  </BrowserRouter>
  )
  expect(getByText(/Division/i)).toBeTruthy()
  expect(getByText(/Role/i)).toBeTruthy()
  expect(getByText(/Greatest team ever/i)).toBeTruthy()
  expect(screen.getByText(/kevin/i)).toBeTruthy()
})