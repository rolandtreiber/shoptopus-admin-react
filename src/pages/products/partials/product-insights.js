import {useParams} from "react-router-dom";
import {useCallback, useContext, useEffect, useState} from "react";
import {useMounted} from "../../../hooks/use-mounted";
import {APIContext} from "../../../contexts/api-context";
import {Box, Card, Grid, Link, List, ListItemText, Skeleton} from "@material-ui/core";
import {PieChartBreakdown} from "../../reports/components/pie-chart-breakdown";
import {Timeline} from "../../reports/components/timeline";
import ListItemGridKeyValue from "../../../components/common/list-item-grid-key-value";
import {format} from "date-fns";
import Price from "../../../components/common/price";
import IconButton from "@material-ui/core/IconButton";
import {NorthEast} from "@material-ui/icons";

export const ProductInsights = () => {
    const {productId} = useParams();
    const mounted = useMounted();
    const [insightData, setInsightData] = useState({
        isLoading: true,
    });
    const [salesChartRange, setSalesChartRange] = useState(1);
    const {fetchProductInsights} = useContext(APIContext)

    const getInsightsData = useCallback(async () => {
        try {
            fetchProductInsights(productId, salesChartRange).then(response => {
                if (response !== undefined && response.status === 200) {
                    setInsightData({...insightData, data: response.data.data, isLoading: false})
                }
            })
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setInsightData(() => ({
                    isLoading: false,
                    error: err.message
                }));
            }
        }
    }, [mounted.current, salesChartRange]);

    useEffect(() => {
        getInsightsData().catch(e => {
            console.log(e.message)
        })
    }, [salesChartRange])

    return <div>
        {insightData.isLoading ? (
            <Box sx={{p: 2}}>
                <Skeleton height={42}/>
                <Skeleton height={42}/>
                <Skeleton height={42}/>
            </Box>
        ) : <Grid container spacing={3}>
            <Grid
                item
                md={12}
                xs={12}
            >
                <PieChartBreakdown series={insightData.data?.overall_satisfaction} title={"Overall satisfaction"}
                                   showRangeSelector={false} stars={true}/>
            </Grid>
            <Grid item xs={12}>
                <Timeline title={'Sales timeline'} data={insightData.data?.sales_timeline}
                          onRangeChange={setSalesChartRange}/>
            </Grid>
            <Grid item xs={12}>
                <Card variant="outlined" sx={{padding: 2}}>
                    <Grid container spacing={2}>
                    {insightData.data?.latest_orders.map((order) => (
                        <Grid key={order.id}
                            item
                            md={6}
                            xs={6}
                        >
                            <Card xs={12} variant="outlined" sx={{padding: 2}}>
                                <List>
                                    <ListItemGridKeyValue
                                        left={<ListItemText>Slug</ListItemText>}
                                        right={<ListItemText>{order.slug}
                                            <Link href={'/admin/orders/' + order.id} target={"_blank"}>
                                                <IconButton aria-label="locate" size={"small"}>
                                                    <NorthEast/>
                                                </IconButton>
                                            </Link>
                                        </ListItemText>}
                                    />
                                    <ListItemGridKeyValue
                                        left={<ListItemText>Placed</ListItemText>}
                                        right={<ListItemText>{format(new Date(order.placed_at), 'dd-MMM-yyyy HH:mm')}</ListItemText>}
                                    />
                                    <ListItemGridKeyValue
                                        left={<ListItemText>Customer</ListItemText>}
                                        right={<ListItemText>{order.user.name}
                                            <Link href={'/admin/customers/' + order.user.id} target={"_blank"}>
                                                <IconButton aria-label="locate" size={"small"}>
                                                    <NorthEast/>
                                                </IconButton>
                                            </Link>
                                    </ListItemText>}
                                    />
                                    <ListItemGridKeyValue
                                        left={<ListItemText>Amount ordered</ListItemText>}
                                        right={<ListItemText>{order.amount}</ListItemText>}
                                    />
                                    <ListItemGridKeyValue
                                        left={<ListItemText>Order total</ListItemText>}
                                        right={<ListItemText><Price>{order.order_total}</Price></ListItemText>}
                                    />
                                </List>
                            </Card>
                        </Grid>
                    ))}
                    </Grid>
                </Card>
            </Grid>
        </Grid>}
    </div>
}