INSERT INTO emission_factors
(category, activity_type, unit, factor) VALUES

                                            ('transport', 'car', 'km', 0.192),
                                            ('transport', 'bus', 'km', 0.105),
                                            ('transport', 'train', 'km', 0.041),
                                            ('transport', 'flight', 'km', 0.255),

                                            ('electricity', 'grid', 'kWh', 0.82),
                                            ('electricity', 'solar', 'kWh', 0.05),

                                            ('food', 'vegetarian', 'meal', 1.7),
                                            ('food', 'non_vegetarian', 'meal', 5.0),

                                            ('shopping', 'clothing', 'item', 15.0),
                                            ('shopping', 'electronics', 'item', 120.0);