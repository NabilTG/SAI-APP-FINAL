export type Request = {
    id: number;
    created_at: string;
    user_id: string;
    status_id: number;
    product_name: string;
    product_price: number;
    product_qty: number;
    comment: string;
    total_request: number;
    image_url: string;
    pre_approved_by: string | null;
    rejected_by: string | null;
    approved_by: string | null;
  }

  export type ApbRequest = {
    id: number;
    created_at: string;
    user: {
      full_name: string
    }
    user_id: string;
    status_id: number;
    product_name: string;
    product_price: number;
    product_qty: number;
    comment: string;
    total_request: number;
    image_url: string;
    pre_approved_by: string | null;
    rejected_by: string | null;
    approved_by: string | null;

  }
  
  export type CreateRequest = {
    user_id: string;
    status_id: number;
    product_name: string;
    product_price: number;
    product_qty: number;
    comment: string;
    total_request: number;
    image_url: string;
  }