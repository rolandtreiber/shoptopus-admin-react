import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useMounted} from "../hooks/use-mounted";
import {useSelection} from "../hooks/use-selection";
import {APIContext} from "../contexts/api-context";

const ProductCategories = () => {
    const [categories, setCategories] = useState({isLoading: true})
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
    ] = useSelection(categories.data?.categories);
    // const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProductCategories} = useContext(APIContext)

    const getCategories = useCallback(async () => {
        setCategories(() => ({ isLoading: true }));

        try {
            const result = await fetchProductCategories({
                page: controller.page,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: controller.filters,
                view: controller.view
            })

            if (mounted.current) {
                setCategories(() => ({
                    isLoading: false,
                    data: result.data.data,
                    paginationMeta: result.data.meta
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setCategories(() => ({
                    isLoading: false,
                    error: err.message
                }));
            }
        }
    }, [controller]);

    useEffect(() => {
        getCategories().catch(console.error);
    }, [controller]);

    return (
        <>
            <h1>Product Categories</h1>
            <div>{JSON.stringify(categories.data)}</div>
        </>
    )
}

export default ProductCategories