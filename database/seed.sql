-- Seed data for Furniture Company Management System

-- Insert sample customers
INSERT INTO customers (id, name, email, phone) VALUES 
    ('c1111111-1111-1111-1111-111111111111', 'Meraki Interiors', 'contact@merakiinteriors.com', '+91 98765 43210'),
    ('c2222222-2222-2222-2222-222222222222', 'ABC Developers', 'info@abcdevelopers.com', '+91 91234 56780'),
    ('c3333333-3333-3333-3333-333333333333', 'Urban Spaces', 'hello@urbanspaces.in', '+91 88888 77777');

-- Insert sample vendors
INSERT INTO vendors (id, name, contact, phone, payment_terms) VALUES 
    ('v1111111-1111-1111-1111-111111111111', 'WoodMart', '+91 98765 43210', '+91 98765 43210', 30),
    ('v2222222-2222-2222-2222-222222222222', 'Merino Dealer', '+91 91234 56780', '+91 91234 56780', 15),
    ('v3333333-3333-3333-3333-333333333333', 'Steel Works', '+91 99999 88888', '+91 99999 88888', 45);

-- Insert sample customer orders
INSERT INTO customer_orders (id, customer_id, order_number, stage, quote_amount, final_price, advance, primary_vendor_id, notes) VALUES 
    ('o1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'ORD-001', 'Quotations', 65000, NULL, 0, NULL, 'Modular wardrobe 6x7 ft'),
    ('o2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'ORD-002', 'WIP', 120000, 130000, 30000, 'v1111111-1111-1111-1111-111111111111', 'Kitchen L-Shape 10ft'),
    ('o3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'ORD-003', 'Orders', 85000, 85000, 25000, 'v2222222-2222-2222-2222-222222222222', 'Office cabin furniture');

-- Insert sample materials
INSERT INTO materials (order_id, item_name, quantity, unit, vendor_id, estimated_cost) VALUES 
    ('o2222222-2222-2222-2222-222222222222', 'Plywood 19mm', 10, 'pcs', 'v1111111-1111-1111-1111-111111111111', 18000),
    ('o2222222-2222-2222-2222-222222222222', 'Laminate 1mm', 8, 'sheets', 'v2222222-2222-2222-2222-222222222222', 12000),
    ('o3333333-3333-3333-3333-333333333333', 'MDF Board', 15, 'pcs', 'v2222222-2222-2222-2222-222222222222', 22000),
    ('o3333333-3333-3333-3333-333333333333', 'Hardware Set', 5, 'sets', 'v3333333-3333-3333-3333-333333333333', 8000);

-- Insert sample expenses
INSERT INTO expenses (id, vendor_id, expense_number, stage, bill_amount, for_order_id) VALUES 
    ('e1111111-1111-1111-1111-111111111111', 'v1111111-1111-1111-1111-111111111111', 'PO-001', 'PO Sent', 18000, 'o2222222-2222-2222-2222-222222222222'),
    ('e2222222-2222-2222-2222-222222222222', 'v2222222-2222-2222-2222-222222222222', 'PO-002', 'Bill Received', 12000, 'o2222222-2222-2222-2222-222222222222'),
    ('e3333333-3333-3333-3333-333333333333', 'v3333333-3333-3333-3333-333333333333', 'PO-003', 'Approved', 5000, NULL);

-- Insert sample expense items
INSERT INTO expense_items (expense_id, item_name, quantity, unit_price, total_price) VALUES 
    ('e1111111-1111-1111-1111-111111111111', 'Plywood 19mm', 10, 1800, 18000),
    ('e2222222-2222-2222-2222-222222222222', 'Laminate 1mm', 8, 1500, 12000),
    ('e3333333-3333-3333-3333-333333333333', 'Office Supplies', 1, 5000, 5000);

-- Insert sample transactions
INSERT INTO transactions (type, reference_id, amount, payment_method, notes) VALUES 
    ('revenue', 'o2222222-2222-2222-2222-222222222222', 30000, 'Bank Transfer', 'Advance payment for Kitchen order'),
    ('revenue', 'o3333333-3333-3333-3333-333333333333', 25000, 'Cash', 'Advance payment for Office furniture'),
    ('expense', 'e3333333-3333-3333-3333-333333333333', 5000, 'UPI', 'Office supplies payment');
