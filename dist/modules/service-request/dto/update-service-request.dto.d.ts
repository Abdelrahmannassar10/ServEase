import { ServiceStatus } from '../../../common/types/enum';
export declare class UpdateServiceRequestDto {
    status?: ServiceStatus;
    price?: number;
    endTime?: string;
    completionCode?: string;
    providerCancelCount?: number;
    providerCancelFees?: number;
}
