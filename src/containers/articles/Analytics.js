import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import '../../../node_modules/react-vis/dist/style.css';
import { TextField, Chip } from '@material-ui/core';
import { unauthorized } from '../../state/httpClient';
import EndpointConstants from '../../constants/EndpointConstants';
import DatePicker from '../../components/analytics/DatePicker';
import Chart from './Chart';
import { wording } from '../../components/common/common';

const MAX_WORDS = 3;

const Analytics = () => {
    const [keywords, setKeywords] = useState([]);
    const [response, setResponse] = useState([]);
    const [async, setAsync] = useState({ isLoading: false, error: null });
    const [dates, setDates] = useState({ startDate: null, endDate: null });

    const [searchQuery, setSearchQuery] = useState('');

    async function loadAnalytics(query) {
        const { method, path } = EndpointConstants.ANALYTICS_GET_TERMS;
        try {
            setAsync({ isLoading: true, error: null });
            const res = await unauthorized({
                method,
                path: path({
                    query,
                    timeFrom: dates.startDate.valueOf(),
                    timeTo: dates.endDate.valueOf()
                })
            });
            setResponse([...response, res]);
            setKeywords([...keywords, query]);
            setSearchQuery('');
            setAsync({ isLoading: false, error: null });
        } catch (err) {
            setAsync({ isLoading: false, error: err });
        }
    }

    function handleKeyPress(e) {
        const { value } = e.target;
        if (e.key === 'Enter') {
            loadAnalytics(value);
        }
    }

    function handleChange(e) {
        if (async.error) {
            setAsync({ ...async, error: null });
        }
        setSearchQuery(e.target.value);
    }

    function handleDelete(index) {
        setKeywords([
            ...keywords.slice(0, index),
            ...keywords.slice(index + 1)
        ]);
        setResponse([
            ...response.slice(0, index),
            ...response.slice(index + 1)
        ]);
        setSearchQuery('');
    }

    function renderKeyWords() {
        if (!keywords.length) {
            return null;
        }
        return keywords.map((keyword, index) => (
            <Chip
                variant="outlined"
                color="default"
                label={keyword}
                onDelete={() => handleDelete(index)}
            />
        ));
    }

    function renderHelperText() {
        if (async.error) {
            return wording.analytics.keywordNotFound;
        }
        if (keywords.length === 0 && (!dates.startDate || !dates.endDate)) {
            return wording.analytics.noDateSelected;
        }
        if (keywords.length === MAX_WORDS) {
            return wording.analytics.maxKeywords;
        }
        return '';
    }

    return (
        <Grid container justify="center" style={{ marginTop: 20 }}>
            <Grid item xs={10} md={4} xl={6}>
                <Grid container>
                    <Grid item xs={12}>
                        <DatePicker
                            dates={dates}
                            handleDateChange={setDates}
                            keywords={keywords}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Suchbegriff"
                            type="search"
                            error={async.error}
                            helperText={renderHelperText()}
                            onKeyPress={handleKeyPress}
                            variant="outlined"
                            value={searchQuery}
                            fullWidth
                            onChange={handleChange}
                            disabled={
                                keywords.length === MAX_WORDS ||
                                dates.startDate === null ||
                                dates.endDate === null
                            }
                            InputLabelProps={{ style: { zIndex: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {renderKeyWords()}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} justify="center">
                <Chart data={response} />
            </Grid>
        </Grid>
    );
};
export default Analytics;
