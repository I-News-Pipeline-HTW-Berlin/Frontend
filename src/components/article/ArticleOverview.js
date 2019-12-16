import React from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import ArticlePreview from './ArticlePreview';
import { ArticlePropTypes } from '../../constants/NewsPropTypes';

const ArticleOverview = ({ articles, async, handleArticleClick }) => {
    const { error, isLoading } = async;
    return error ? (
        <p> An error occurred</p>
    ) : (
        <Grid container>
            {articles.map(article => {
                const { mongo_id: id, title } = article;
                return (
                    <Grid
                        xs={12}
                        sm={6}
                        md={4}
                        item
                        style={{ marginBottom: 20 }}
                        key={`grid${id}`}
                    >
                        <ArticlePreview
                            title={title}
                            author={articles.authors && articles.authors.join()}
                            onClick={() => handleArticleClick(article)}
                            isLoading={isLoading}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
};

ArticleOverview.propTypes = {
    articles: PropTypes.arrayOf(ArticlePropTypes).isRequired,
    handleArticleClick: PropTypes.func.isRequired,
    async: PropTypes.shape({
        isLoading: PropTypes.bool.isRequired,
        error: PropTypes.object.isRequired
    }).isRequired
};
export default ArticleOverview;