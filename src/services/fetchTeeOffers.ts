import { getSdk } from "../gql";
import { GraphQLClient } from "graphql-request";
import { formatDate } from "../utils";
import getGqlHeaders from "./gqlHeaders";

export type FetchTeeOffersParams = {
    backendUrl: string;
    accessToken: string;
    limit: number;
    cursor?: string;
    id?: string;
};

export default async (params: FetchTeeOffersParams) => {
    const sdk = getSdk(new GraphQLClient(params.backendUrl));
    const headers = getGqlHeaders(params.accessToken);

    const { result } = await sdk.TeeOffers(
        {
            pagination: {
                first: params.limit,
                after: params.cursor,
                sortDir: "DESC",
                sortBy: "origins.createdDate",
            },
            filter: { id: params.id },
        },
        headers
    );

    return {
        list:
            result.page.edges?.map((item) => ({
                id: item.node?.id,
                name: item.node?.teeOfferInfo?.name,
                description: item.node?.teeOfferInfo?.description,
                providerName: item.node?.providerInfo.name,
                providerAddress: item.node?.origins?.createdBy,
                totalCores: item.node?.teeOfferInfo.slots,
                freeCores: item.node?.stats?.freeCores,
                ordersInQueue: item.node?.stats?.ordersInQueue,
                cancelable: false,
                modifiedDate: formatDate(item.node?.origins?.modifiedDate),
            })) || [],
        cursor: result.page.pageInfo!.endCursor,
    };
};
