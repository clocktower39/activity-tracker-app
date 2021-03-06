import { LOGIN_USER, LOGOUT_USER, ERROR, UPDATE_ACTIVITY, UPDATE_CATEGORIES, DELETE_GOAL } from './actions';
import { goals, categories, user } from './states';

export let reducer = (state = { goals, categories, user }, action) => {
    switch (action.type) {
    case LOGIN_USER:
        return {
            ...state,
            user: {
                ...action.user,
            },
        }
    case LOGOUT_USER:
        return {
            ...state,
            goals: [],
            user: {
                themeMode: 'dark',
            },
        }
    case UPDATE_ACTIVITY:
        return {
            ...state,
            goals: [...action.newState.goals],
            categories: [...action.newState.categories],
        }
    case UPDATE_CATEGORIES:
        return {
            ...state,
            categories: [...action.categories],
        }
    case DELETE_GOAL:
        return {
            ...state,
            goals: [ ...state.goals.filter(goal => goal._id !== action.goalId) ]
        }
    case ERROR:
        return {
            ...state,
            error: { ...action.error }
        }

    default:
        return state
    }
}

