import {useCallback, useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useParams} from "react-router-dom";
import {useMounted} from "../../../hooks/use-mounted";
import {Star as StarIcon} from "../../../icons/star";
import {Box, Card, Grid, Link, List, ListItemText, Skeleton} from "@material-ui/core";
import {format} from "date-fns";
import IconButton from "@material-ui/core/IconButton";
import {NorthEast} from "@material-ui/icons";

export const ProductRatings = (props) => {
    const {fetchRatings} = useContext(APIContext)
    const mounted = useMounted();
    const {productId} = useParams();
    const [ratings, setRatings] = useState({
        isLoading: true
    })
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'updated_at',
        view: 'all'
    });

    const getRatings = useCallback(async () => {
            setRatings(() => ({ isLoading: true }));
            try {
                const result = await fetchRatings({
                    page: controller.page+1,
                    paginate: 20,
                    sort_by_type: controller.sort,
                    sort_by_field: controller.sortBy,
                    filters: [
                        ["ratable_id", productId]
                    ],
                    view: controller.view
                })

                if (mounted.current) {
                    setRatings(() => ({
                        isLoading: false,
                        data: result.data.data,
                        paginationMeta: result.data.meta
                    }));
                }
            } catch (err) {
                console.error(err);

                if (mounted.current) {
                    setRatings(() => ({
                        isLoading: false,
                        error: err.message
                    }));
                }
            }
        }, [controller]);

    const getStars = (rating) => {
        let stars = [];
        for (let i = 0; i < rating; i++) {
            stars = [...stars, (<StarIcon key={'star-' + i} style={{'color': '#cebf17'}}/>)]
        }
        return stars
    }

    useEffect(() => {
        getRatings().catch(e => console.log(e.message))
    }, [])

    return (
        <div>
        {ratings.isLoading ? (
            <Box sx={{ p: 2 }}>
                <Skeleton height={42} />
                <Skeleton height={42} />
                <Skeleton height={42} />
            </Box>
        ): <>
            {ratings.data && (<Grid container spacing={2}>
                {ratings.data.length > 0 ? ratings.data.map(rating => (<Grid key={rating.id} item xs={12} lg={6}>
                    <Card variant="outlined" sx={{padding: 1, position: "relative"}}>
                        <Grid item xs={12}>
                            <List>
                                <ListItemText>{getStars(rating.rating)}</ListItemText>
                                <ListItemText><strong>{rating.user_name}</strong></ListItemText>
                                <ListItemText>{rating.description}</ListItemText>
                                <ListItemText>{format(new Date(rating.left_at), 'dd-MMM-yyyy HH:mm')}</ListItemText>
                            </List>
                        </Grid>
                        <Link href={'/ratings/' + rating.id} target={"_blank"}><IconButton
                            sx={{position: "absolute", bottom: 10, right: 10}}><NorthEast/></IconButton></Link>
                    </Card>
                </Grid>)) : (<Grid item xs={12}>
                    <Card variant="outlined" style={{padding: 10}}>
                        No ratings to display
                    </Card>
                </Grid>)}
            </Grid>)}
        </>}
        </div>
    )
}