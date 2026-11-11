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

entity MaintenanceNotifications {
  key ID                 : UUID;
      notificationNumber : String(20);
      orderNumber        : String(20);
      equipment          : String(40);
      title              : String(100);
      description        : LargeString;
      priority           : String(20);
      status             : String(30);
      createdAt          : Timestamp;
}
