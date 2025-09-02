USE fvision;

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS fib (
    id INT PRIMARY KEY,
    value NUMERIC(50,0)
);

-- Refresh table data
TRUNCATE TABLE fib;

-- Load CSV
LOAD DATA LOCAL INFILE '/vagrant/fib.csv'
INTO TABLE fib
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, value);
