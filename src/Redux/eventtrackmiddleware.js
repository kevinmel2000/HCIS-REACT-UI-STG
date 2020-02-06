const eventTrackMiddleware = store => next => action => {
    // console.warn('dispatching', action)
    let actionType = action.type;
    if(actionType) {   
        if (typeof action.error == "string") {
            alert(action.error);
        }
    }

    let result = next(action);
    // console.warn('next state', store.getState())
    return result;
}

export default eventTrackMiddleware;