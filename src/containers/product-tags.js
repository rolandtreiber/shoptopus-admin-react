import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useMounted} from "../hooks/use-mounted";
import {useSelection} from "../hooks/use-selection";
import {APIContext} from "../contexts/api-context";

const ProductTags = () => {
    const [tags, setTags] = useState({isLoading: true})
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'updated_at',
        view: 'all'
    });
    const [
        selectedCategories,
        handleSelect,
        handleSelectAll
    ] = useSelection(tags.data?.tags);
    // const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProductTags} = useContext(APIContext)

    const getAttributes = useCallback(async () => {
        setTags(() => ({ isLoading: true }));

        try {
            const result = await fetchProductTags({
                page: controller.page,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: controller.filters,
                view: controller.view
            })

            if (mounted.current) {
                setTags(() => ({
                    isLoading: false,
                    data: result.data.data,
                    paginationMeta: result.data.meta
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setTags(() => ({
                    isLoading: false,
                    error: err.message
                }));
            }
        }
    }, [controller]);

    useEffect(() => {
        getAttributes().catch(console.error);
    }, [controller]);

    return (
        <>
            <h1>Product Tags</h1>
            <div>{JSON.stringify(tags.data)}</div>
        </>
    )
}

export default ProductTags