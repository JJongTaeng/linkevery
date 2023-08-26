import { useReducer } from 'react';

export function useSlice<T, S extends string | number | symbol>(
  actions: Record<S, (state: T, action: { type: S; payload: Partial<T> }) => T>,
  initialState: T,
): [T, Record<S, (payload: Partial<T>) => void>] {
  const reducer: (state: T, action: { type: S; payload: Partial<T> }) => T = (
    state,
    action,
  ) => {
    if (action.type in actions) {
      return actions[action.type](state, action);
    } else {
      return state;
    }
  };

  const [state, _dispatch] = useReducer(reducer, initialState);

  const createActionDispatchers = (
    actions: Record<
      S,
      (state: T, action: { type: S; payload: Partial<T> }) => T
    >,
  ) => {
    // @ts-ignore
    const dispatchers: Record<S, (payload?: any) => void> = {};

    for (const actionType in actions) {
      dispatchers[actionType] = (payload) =>
        _dispatch({ type: actionType, payload });
    }

    return dispatchers;
  };

  const dispatch = createActionDispatchers(actions);

  return [state, dispatch];
}
