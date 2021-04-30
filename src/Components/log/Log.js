import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import LogItem from './LogItem';

export const Log = (props) => {
    const goals = useSelector(state => state.goals);
    return (
        <Grid container>
        <Grid container item xs={12} variant={"h3"}>
            <Grid item xs={4}>
                <Typography variant={'h4'}>Task</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant={'h4'}>Interval</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant={'h4'}>Target</Typography>
            </Grid>
        </Grid>
            {goals.map(goal => <LogItem goal={goal} />)}
        </Grid>
    )
}

export default Log
