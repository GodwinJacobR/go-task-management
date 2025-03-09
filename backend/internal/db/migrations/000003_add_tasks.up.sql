INSERT INTO tasks (task_id, user_id, title, description, due_date, attributes)
VALUES ('2ec067fe-257a-43b4-ade7-d8d595cb7422', 'efa8b9f7-010b-451f-afd9-dcee281d4623', 'Buy groceries', 'Buy milk, eggs, and bread', '2023-10-15', '{"priority": "high", "estimated_time": "2 hours"}');

INSERT INTO tasks (task_id, user_id, title, description, due_date, attributes)
VALUES ('efa8b9f7-010b-451f-afd9-dcee281d4623', 'efa8b9f7-010b-451f-afd9-dcee281d4623', 'Buy groceries', 'Buy milk, eggs, and bread', '2023-10-15', '{"priority": "high", "estimated_time": "2 hours"}');

INSERT INTO tasks (task_id, user_id, parent_task_id, title, description, due_date, attributes)
VALUES ('4c448a9e-d6f7-4f83-a794-d20c25e577f9', 'efa8b9f7-010b-451f-afd9-dcee281d4623', 'efa8b9f7-010b-451f-afd9-dcee281d4623', 'Buy groceries', 'Another task', '2023-10-15', '{"priority": "high", "estimated_time": "2 hours"}');

INSERT INTO tasks (task_id, user_id, parent_task_id, title, description, due_date, attributes)
VALUES ('13a07b6b-e04c-4cce-841a-45b1ecc10721', 'efa8b9f7-010b-451f-afd9-dcee281d4623', 'efa8b9f7-010b-451f-afd9-dcee281d4623', 'Buy groceries', 'Another task', '2023-10-15', '{"priority": "high", "estimated_time": "2 hours"}');

INSERT INTO tasks (task_id, user_id, parent_task_id, title, description, due_date, attributes)
VALUES ('fe71b31a-35fb-430c-9f1e-628f409fa20e', 'efa8b9f7-010b-451f-afd9-dcee281d4623', '2ec067fe-257a-43b4-ade7-d8d595cb7422', 'Buy groceries', 'Another task', '2023-10-15', '{"priority": "high", "estimated_time": "2 hours"}');



