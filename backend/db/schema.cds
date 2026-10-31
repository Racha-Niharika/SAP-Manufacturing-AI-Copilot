namespace manufacturing;

entity ProductionOrders {
  key ID           : UUID;
      orderNumber  : String(20);
      material     : String(40);
      description  : String(100);
      plannedQty   : Integer;
      completedQty : Integer;
      status       : String(30);
      plant        : String(10);
}
