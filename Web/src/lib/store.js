import { createGlobalState } from 'react-hooks-global-state'

const initialState = {
  connectedAccount: ''
}

const { useGlobalState, setGlobalState } = createGlobalState(initialState)

export { useGlobalState, setGlobalState }