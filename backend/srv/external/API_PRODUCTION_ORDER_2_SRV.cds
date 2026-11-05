/* checksum : 983c5a08a52510022f9773b220231523 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service API_PRODUCTION_ORDER_2_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Order Serial Numbers'
entity API_PRODUCTION_ORDER_2_SRV.A_ProdnOrderItemSerialNumber {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Manufacturing Order'
  @sap.quickinfo : 'Manufacturing Order ID'
  key ManufacturingOrder : String(12) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Manufacturing Order Item'
  @sap.quickinfo : 'Manufacturing Order Item ID'
  key ManufacturingOrderItem : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Serial Number'
  key SerialNumber : String(18) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Serial Number Profile'
  SerialNumberProfile : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Product'
  Product : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Category'
  @sap.quickinfo : 'Manufacturing Order Category'
  ManufacturingOrderCategory : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  @sap.quickinfo : 'Manufacturing Order Type'
  ManufacturingOrderType : String(4);
  @sap.display.format : 'Date'
  @sap.label : 'Date'
  DocumentDate : Date;
  @sap.semantics : 'duration'
  LastChangeDateTime : String(14);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Order Components'
entity API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderComponent_2 {
  @sap.display.format : 'NonNegative'
  @sap.label : 'Reservation'
  @sap.quickinfo : 'Number of reservation/dependent requirements'
  key Reservation : String(10) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Reservation Item'
  key ReservationItem : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Group'
  MaterialGroup : String(9);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  Plant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Category'
  @sap.quickinfo : 'Manufacturing Order Category'
  ManufacturingOrderCategory : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  @sap.quickinfo : 'Manufacturing Order Type'
  ManufacturingOrderType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Order'
  ManufacturingOrder : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sequence'
  ManufacturingOrderSequence : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Operation'
  @sap.quickinfo : 'Manufacturing Order Operation'
  ManufacturingOrderOperation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Internal ID'
  OrderInternalBillOfOperations : String(10);
  @sap.display.format : 'Date'
  @sap.label : 'Requirement Date'
  @sap.quickinfo : 'Material Component Requirement Date'
  MatlCompRequirementDate : Date;
  @sap.label : 'Requirement Time'
  @sap.quickinfo : 'Material Component Requirement Time'
  MatlCompRequirementTime : Time;
  @sap.label : 'Final Issue'
  @sap.quickinfo : 'Final Issue for Reservation'
  ReservationIsFinallyIssued : Boolean;
  @sap.label : 'Marked for Deletion'
  MatlCompIsMarkedForDeletion : Boolean;
  @sap.label : 'Bulk Material'
  @sap.quickinfo : 'Indicator: Bulk Material'
  IsBulkMaterialComponent : Boolean;
  @sap.label : 'Backflush'
  @sap.quickinfo : 'Indicator: Backflush'
  MatlCompIsMarkedForBackflush : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'CostingRelevncy'
  @sap.quickinfo : 'Indicator for Relevancy to Costing'
  MaterialCompIsCostRelevant : String(1);
  @sap.label : 'Long Text'
  OrderComponentLongText : String;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Order Item'
  SalesOrderItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sort String'
  SortField : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'BOM Category'
  @sap.quickinfo : 'Bill of Material Category Code'
  BillOfMaterialCategory : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'BOM Item'
  @sap.quickinfo : 'Bill of Material Item'
  BOMItem : String(8);
  @sap.display.format : 'UpperCase'
  @sap.label : 'BOM Item Category'
  @sap.quickinfo : 'Bill of Material Item Category'
  BOMItemCategory : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'BOM Item'
  @sap.quickinfo : 'BOM item number'
  BillOfMaterialItemNumber : String(4);
  @sap.label : 'BOM Item Text'
  @sap.quickinfo : 'BOM Item Text (Line 1)'
  BOMItemDescription : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Location'
  StorageLocation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch'
  @sap.quickinfo : 'Batch Number'
  Batch : String(10);
  BatchSplitType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Movement Type'
  @sap.quickinfo : 'Movement Type (Inventory Management)'
  GoodsMovementType : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Supply Area'
  SupplyArea : String(10);
  @sap.label : 'Goods Recipient'
  GoodsRecipientName : String(12);
  @sap.label : 'Unloading Point'
  UnloadingPointName : String(25);
  @sap.label : 'Alternative Item'
  @sap.quickinfo : 'Alternative Item Indicator'
  MaterialCompIsAlternativeItem : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative Item Group'
  AlternativeItemGroup : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative Item Strategy'
  AlternativeItemStrategy : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Alternative Item Priority'
  AlternativeItemPriority : String(2);
  @sap.label : 'Usage Probability'
  @sap.quickinfo : 'Usage Probability in % (Alternative Item)'
  UsageProbabilityPercent : Decimal(3, 0);
  @sap.label : 'Phantom Item'
  @sap.quickinfo : 'Phantom Item Indicator'
  MaterialComponentIsPhantomItem : Boolean;
  @sap.label : 'Lead-Time Offset'
  LeadTimeOffset : Decimal(3, 0);
  @sap.label : 'Quantity is fixed'
  QuantityIsFixed : Boolean;
  @sap.label : 'Net Scrap Indicator'
  IsNetScrap : Boolean;
  @sap.label : 'Component Scrap (%)'
  @sap.quickinfo : 'Component Scrap in Percent'
  ComponentScrapInPercent : Decimal(5, 2);
  @sap.label : 'Operation Scrap in %'
  @sap.quickinfo : 'Operation Scrap'
  OperationScrapInPercent : Decimal(5, 2);
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  BaseUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  BaseUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  BaseUnitSAPCode : String(3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Requirement Quantity'
  RequiredQuantity : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Withdrawn Quantity'
  WithdrawnQuantity : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Available Quantity'
  ConfirmedAvailableQuantity : Decimal(15, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Original Quantity'
  @sap.quickinfo : 'Original Quantity of a Material Component'
  MaterialCompOriginalQuantity : Decimal(13, 3);
  @sap.label : 'Unit of Entry'
  @sap.quickinfo : 'Unit of entry'
  @sap.semantics : 'unit-of-measure'
  EntryUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  EntryUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  EntryUnitSAPCode : String(3);
  @sap.unit : 'EntryUnit'
  @sap.label : 'Quantity in Unit of Entry'
  GoodsMovementEntryQty : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Currency : String(5);
  @sap.unit : 'Currency'
  @sap.label : 'Value Withdrawn'
  WithdrawnQuantityAmount : Decimal(14, 3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Order Components Extended'
entity API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderComponent_3 {
  @sap.display.format : 'NonNegative'
  @sap.label : 'Reservation'
  @sap.quickinfo : 'Number of reservation/dependent requirements'
  key Reservation : String(10) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Reservation Item'
  key ReservationItem : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reservation Record Type'
  key ReservationRecordType : String(1) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Group'
  MaterialGroup : String(9);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  Plant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Category'
  @sap.quickinfo : 'Manufacturing Order Category'
  ManufacturingOrderCategory : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  @sap.quickinfo : 'Manufacturing Order Type'
  ManufacturingOrderType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Order'
  ManufacturingOrder : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sequence'
  ManufacturingOrderSequence : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Operation or Phase'
  @sap.quickinfo : 'Operation or Phase Number'
  ManufacturingOrderOperation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Internal ID'
  OrderInternalBillOfOperations : String(10);
  @sap.display.format : 'Date'
  @sap.label : 'Requirement Date'
  @sap.quickinfo : 'Material Component Requirement Date'
  MatlCompRequirementDate : Date;
  @sap.label : 'Requirement Time'
  @sap.quickinfo : 'Material Component Requirement Time'
  MatlCompRequirementTime : Time;
  @sap.label : 'Final Issue'
  @sap.quickinfo : 'Final Issue for Reservation'
  ReservationIsFinallyIssued : Boolean;
  @sap.label : 'Marked for Deletion'
  MatlCompIsMarkedForDeletion : Boolean;
  @sap.label : 'Bulk Material'
  @sap.quickinfo : 'Indicator: Bulk Material'
  IsBulkMaterialComponent : Boolean;
  @sap.label : 'Backflush'
  @sap.quickinfo : 'Indicator: Backflush'
  MatlCompIsMarkedForBackflush : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'CostingRelevncy'
  @sap.quickinfo : 'Indicator for Relevancy to Costing'
  MaterialCompIsCostRelevant : String(1);
  @sap.label : 'Long Text'
  OrderComponentLongText : String;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Order Item'
  SalesOrderItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sort String'
  MatlCompFreeDefinedAttribute : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'BOM Category'
  @sap.quickinfo : 'Bill of Material Category Code'
  BillOfMaterialCategory : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'BOM Item'
  @sap.quickinfo : 'Bill of Material Item'
  BOMItem : String(8);
  @sap.display.format : 'UpperCase'
  @sap.label : 'BOM Item Category'
  @sap.quickinfo : 'Bill of Material Item Category'
  BOMItemCategory : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bill Of Material Item Number'
  BillOfMaterialItemNumber : String(4);
  @sap.label : 'BOM Item Text'
  @sap.quickinfo : 'BOM Item Text (Line 1)'
  BOMItemDescription : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Location'
  StorageLocation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch'
  @sap.quickinfo : 'Batch Number'
  Batch : String(10);
  BatchSplitType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Movement Type'
  @sap.quickinfo : 'Movement Type (Inventory Management)'
  GoodsMovementType : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Supply Area'
  SupplyArea : String(10);
  @sap.label : 'Goods Recipient'
  GoodsRecipientName : String(12);
  @sap.label : 'Unloading Point'
  UnloadingPointName : String(25);
  @sap.label : 'Alternative Item'
  @sap.quickinfo : 'Alternative Item Indicator'
  MaterialCompIsAlternativeItem : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative Item Group'
  AlternativeItemGroup : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative Item Strategy'
  AlternativeItemStrategy : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Alternative Item Priority'
  AlternativeItemPriority : String(2);
  @sap.label : 'Usage Probability'
  @sap.quickinfo : 'Usage Probability in % (Alternative Item)'
  UsageProbabilityPercent : Decimal(3, 0);
  @sap.label : 'Phantom Item'
  @sap.quickinfo : 'Phantom Item Indicator'
  MaterialComponentIsPhantomItem : Boolean;
  @sap.label : 'Lead-Time Offset'
  LeadTimeOffset : Decimal(3, 0);
  @sap.label : 'Quantity is fixed'
  QuantityIsFixed : Boolean;
  @sap.label : 'Net Scrap Indicator'
  IsNetScrap : Boolean;
  @sap.label : 'Component Scrap (%)'
  @sap.quickinfo : 'Component Scrap in Percent'
  ComponentScrapInPercent : Decimal(5, 2);
  @sap.label : 'Operation Scrap in %'
  @sap.quickinfo : 'Operation Scrap'
  OperationScrapInPercent : Decimal(5, 2);
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  BaseUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  BaseUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  BaseUnitSAPCode : String(3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Requirement Quantity'
  RequiredQuantity : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Withdrawn Quantity'
  WithdrawnQuantity : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Available Quantity'
  ConfirmedAvailableQuantity : Decimal(15, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Original Quantity'
  @sap.quickinfo : 'Original Quantity of a Material Component'
  MaterialCompOriginalQuantity : Decimal(13, 3);
  @sap.label : 'Unit of Entry'
  @sap.quickinfo : 'Unit of entry'
  @sap.semantics : 'unit-of-measure'
  EntryUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  EntryUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  EntryUnitSAPCode : String(3);
  @sap.unit : 'EntryUnit'
  @sap.label : 'Quantity in Unit of Entry'
  GoodsMovementEntryQty : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Currency : String(5);
  @sap.unit : 'Currency'
  @sap.label : 'Value Withdrawn'
  WithdrawnQuantityAmount : Decimal(14, 3);
  @sap.semantics : 'duration'
  LastChangeDateTime : String(14);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Order Components Using RAP BO'
entity API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderComponent_4 {
  @sap.display.format : 'NonNegative'
  @sap.label : 'Reservation'
  @sap.quickinfo : 'Number of reservation/dependent requirements'
  key Reservation : String(10) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Reservation Item'
  key ReservationItem : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reservation Record Type'
  key ReservationRecordType : String(1) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Group'
  MaterialGroup : String(9);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  Plant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Category'
  @sap.quickinfo : 'Manufacturing Order Category'
  ManufacturingOrderCategory : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  @sap.quickinfo : 'Manufacturing Order Type'
  ManufacturingOrderType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Order'
  ManufacturingOrder : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sequence'
  ManufacturingOrderSequence : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Operation or Phase'
  @sap.quickinfo : 'Operation or Phase Number'
  ManufacturingOrderOperation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Internal ID'
  OrderInternalBillOfOperations : String(10);
  @sap.display.format : 'Date'
  @sap.label : 'Requirement Date'
  @sap.quickinfo : 'Material Component Requirement Date'
  MatlCompRequirementDate : Date;
  @sap.label : 'Requirement Time'
  @sap.quickinfo : 'Material Component Requirement Time'
  MatlCompRequirementTime : Time;
  @sap.label : 'Final Issue'
  @sap.quickinfo : 'Final Issue for Reservation'
  ReservationIsFinallyIssued : Boolean;
  @sap.label : 'Marked for Deletion'
  MatlCompIsMarkedForDeletion : Boolean;
  @sap.label : 'Bulk Material'
  @sap.quickinfo : 'Indicator: Bulk Material'
  IsBulkMaterialComponent : Boolean;
  @sap.label : 'Backflush'
  @sap.quickinfo : 'Indicator: Backflush'
  MatlCompIsMarkedForBackflush : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'CostingRelevncy'
  @sap.quickinfo : 'Indicator for Relevancy to Costing'
  MaterialCompIsCostRelevant : String(1);
  @sap.label : 'Long Text'
  OrderComponentLongText : String;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Order Item'
  SalesOrderItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sort String'
  MatlCompFreeDefinedAttribute : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'BOM Category'
  @sap.quickinfo : 'Bill of Material Category Code'
  BillOfMaterialCategory : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'BOM Item'
  @sap.quickinfo : 'Bill of Material Item'
  BOMItem : String(8);
  @sap.display.format : 'UpperCase'
  @sap.label : 'BOM Item Category'
  @sap.quickinfo : 'Bill of Material Item Category'
  BOMItemCategory : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bill Of Material Item Number'
  BillOfMaterialItemNumber : String(4);
  @sap.label : 'BOM Item Text'
  @sap.quickinfo : 'BOM Item Text (Line 1)'
  BOMItemDescription : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Location'
  StorageLocation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch'
  @sap.quickinfo : 'Batch Number'
  Batch : String(10);
  BatchSplitType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Movement Type'
  @sap.quickinfo : 'Movement Type (Inventory Management)'
  GoodsMovementType : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Supply Area'
  SupplyArea : String(10);
  @sap.label : 'Goods Recipient'
  GoodsRecipientName : String(12);
  @sap.label : 'Unloading Point'
  UnloadingPointName : String(25);
  @sap.label : 'Alternative Item'
  @sap.quickinfo : 'Alternative Item Indicator'
  MaterialCompIsAlternativeItem : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative Item Group'
  AlternativeItemGroup : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative Item Strategy'
  AlternativeItemStrategy : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Alternative Item Priority'
  AlternativeItemPriority : String(2);
  @sap.label : 'Usage Probability'
  @sap.quickinfo : 'Usage Probability in % (Alternative Item)'
  UsageProbabilityPercent : Decimal(3, 0);
  @sap.label : 'Phantom Item'
  @sap.quickinfo : 'Phantom Item Indicator'
  MaterialComponentIsPhantomItem : Boolean;
  @sap.label : 'Lead-Time Offset'
  LeadTimeOffset : Decimal(3, 0);
  @sap.label : 'Quantity is fixed'
  QuantityIsFixed : Boolean;
  @sap.label : 'Net Scrap Indicator'
  IsNetScrap : Boolean;
  @sap.label : 'Component Scrap (%)'
  @sap.quickinfo : 'Component Scrap in Percent'
  ComponentScrapInPercent : Decimal(5, 2);
  @sap.label : 'Operation Scrap in %'
  @sap.quickinfo : 'Operation Scrap'
  OperationScrapInPercent : Decimal(5, 2);
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  BaseUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  BaseUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  BaseUnitSAPCode : String(3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Requirement Quantity'
  RequiredQuantity : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Withdrawn Quantity'
  WithdrawnQuantity : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Available Quantity'
  ConfirmedAvailableQuantity : Decimal(15, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Original Quantity'
  @sap.quickinfo : 'Original Quantity of a Material Component'
  MaterialCompOriginalQuantity : Decimal(13, 3);
  @sap.label : 'Unit of Entry'
  @sap.quickinfo : 'Unit of entry'
  @sap.semantics : 'unit-of-measure'
  EntryUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  EntryUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  EntryUnitSAPCode : String(3);
  @sap.unit : 'EntryUnit'
  @sap.label : 'Quantity in Unit of Entry'
  GoodsMovementEntryQty : Decimal(13, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Currency : String(5);
  @sap.unit : 'Currency'
  @sap.label : 'Value Withdrawn'
  WithdrawnQuantityAmount : Decimal(14, 3);
  @sap.semantics : 'duration'
  LastChangeDateTime : String(14);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Order Items'
entity API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderItem_2 {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Order'
  key ManufacturingOrder : String(12) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Manufacturing Order Item'
  @sap.quickinfo : 'Manufacturing Order Item ID'
  key ManufacturingOrderItem : String(4) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Category'
  @sap.quickinfo : 'Manufacturing Order Category'
  ManufacturingOrderCategory : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  @sap.quickinfo : 'Manufacturing Order Type'
  ManufacturingOrderType : String(4);
  @sap.label : 'Delivery Completed'
  @sap.quickinfo : '&quot;Delivery Completed&quot; Indicator'
  IsCompletelyDelivered : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number for Order'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Planning Plant'
  @sap.quickinfo : 'Planning Plant for an Order'
  Plant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Area'
  MRPArea : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Key'
  @sap.quickinfo : 'MRP Distribution Key'
  QuantityDistributionKey : String(4);
  @sap.label : 'GR Processing Time'
  @sap.quickinfo : 'Goods Receipt Processing Duration in Days'
  MaterialGoodsReceiptDuration : Decimal(3, 0);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Location'
  StorageLocation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Batch'
  @sap.quickinfo : 'Batch Number'
  Batch : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Inventory Usability'
  @sap.quickinfo : 'Inventory Usability Code'
  InventoryUsabilityCode : String(1);
  @sap.label : 'Goods Recipient'
  GoodsRecipientName : String(12);
  @sap.label : 'Unloading Point'
  UnloadingPointName : String(25);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Stock Segment'
  StockSegment : String(40);
  @sap.display.format : 'Date'
  @sap.label : 'Planned Delivery'
  @sap.quickinfo : 'Delivery Date From Planned Order'
  MfgOrderItemPlndDeliveryDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Actual Delivery Date'
  @sap.quickinfo : 'Actual Delivery/Finish Date'
  MfgOrderItemActualDeliveryDate : Date;
  @sap.label : 'Production Unit'
  @sap.quickinfo : 'Production Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  ProductionUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  ProductionUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  ProductionUnitSAPCode : String(3);
  @sap.unit : 'ProductionUnit'
  @sap.label : 'Total Quantity'
  @sap.quickinfo : 'Order Item Planned Total Quantity'
  MfgOrderItemPlannedTotalQty : Decimal(13, 3);
  @sap.unit : 'ProductionUnit'
  @sap.label : 'Planned Scrap'
  @sap.quickinfo : 'Order Item Planned Scrap Quantity'
  MfgOrderItemPlannedScrapQty : Decimal(13, 3);
  @sap.unit : 'ProductionUnit'
  @sap.label : 'Goods Receipt Quantity'
  @sap.quickinfo : 'Quantity of Goods Received for the Order Item'
  MfgOrderItemGoodsReceiptQty : Decimal(13, 3);
  @sap.unit : 'ProductionUnit'
  @sap.label : 'Expected Deviation'
  @sap.quickinfo : 'Expected Surplus/Deficit For Goods Receipt'
  MfgOrderItemActualDeviationQty : Decimal(13, 3);
  to_ProdnOrderItemSerialNumber : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProdnOrderItemSerialNumber {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Order Operations'
entity API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderOperation_2 {
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Internal ID'
  key OrderInternalBillOfOperations : String(10) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Operation Internal ID'
  @sap.quickinfo : 'Internal Identifier of an Operation or Activity'
  key OrderIntBillOfOperationsItem : String(8) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Order'
  ManufacturingOrder : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sequence'
  @sap.quickinfo : 'Manufacturing Order Sequence'
  ManufacturingOrderSequence : String(6);
  @sap.label : 'Sequence Text'
  @sap.quickinfo : 'Manufacturing Order Sequence Text'
  MfgOrderSequenceText : String(40);
  @sap.display.format : 'UpperCase'
  @sap.text : 'MfgOrderOperationText'
  @sap.label : 'Operation'
  @sap.quickinfo : 'Manufacturing Order Operation'
  ManufacturingOrderOperation : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Suboperation'
  @sap.quickinfo : 'Manufacturing Order Suboperation'
  ManufacturingOrderSubOperation : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Category'
  @sap.quickinfo : 'Manufacturing Order Category'
  ManufacturingOrderCategory : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  @sap.quickinfo : 'Manufacturing Order Type'
  ManufacturingOrderType : String(4);
  @sap.label : 'Operation Text'
  @sap.quickinfo : 'Manufacturing Order Operation Text'
  MfgOrderOperationText : String(40);
  @sap.label : 'Long Text'
  OrderOperationLongText : String;
  @sap.label : 'Long Text'
  OrderSequenceLongText : String;
  OperationIsCreated : String(1);
  OperationIsReleased : String(1);
  OperationIsPrinted : String(1);
  OperationIsConfirmed : String(1);
  OperationIsPartiallyConfirmed : String(1);
  OperationIsDeleted : String(1);
  OperationIsTechlyCompleted : String(1);
  OperationIsClosed : String(1);
  OperationIsScheduled : String(1);
  OperationIsPartiallyDelivered : String(1);
  OperationIsDelivered : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Work Center Internal'
  @sap.quickinfo : 'Work Center Internal ID'
  WorkCenterInternalID : String(8);
  @sap.label : 'Work Center Type Code'
  WorkCenterTypeCode : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Work Center'
  WorkCenter : String(8);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Control Profile'
  @sap.quickinfo : 'Operation Control Profile'
  OperationControlProfile : String(4);
  @sap.display.format : 'Date'
  @sap.label : 'Execution Start Date'
  @sap.quickinfo : 'Earliest Scheduled Execution Start Date'
  OpErlstSchedldExecStrtDte : Date;
  @sap.label : 'Execution Start Time'
  @sap.quickinfo : 'Earliest Scheduled Execution Start Time'
  OpErlstSchedldExecStrtTme : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Execution End Date'
  @sap.quickinfo : 'Earliest Scheduled Execution End Date'
  OpErlstSchedldExecEndDte : Date;
  @sap.label : 'Execution End Time'
  @sap.quickinfo : 'Earliest Scheduled Execution End Time'
  OpErlstSchedldExecEndTme : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Confirmed Execution Start Date'
  @sap.quickinfo : 'Confirmed Start Date of Execution'
  OpActualExecutionStartDate : Date;
  @sap.label : 'Confirmed Execution Start Time'
  @sap.quickinfo : 'Confirmed Start Time of Execution'
  OpActualExecutionStartTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Confirmed Execution End Date'
  @sap.quickinfo : 'Confirmed End Date of Execution'
  OpActualExecutionEndDate : Date;
  @sap.label : 'Confirmed Execution End Time'
  @sap.quickinfo : 'Confirmed End Time of Execution'
  OpActualExecutionEndTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Processing Start Dte'
  @sap.quickinfo : 'Earliest Scheduled Processing Start Date'
  OpErlstSchedldProcgStrtDte : Date;
  @sap.label : 'Processing Start Tme'
  @sap.quickinfo : 'Earliest Scheduled Processing Start Time'
  OpErlstSchedldProcgStrtTme : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Teardown Start Date'
  @sap.quickinfo : 'Earliest Scheduled Teardown Start Date'
  OpErlstSchedldTrdwnStrtDte : Date;
  @sap.label : 'Teardown Start Time'
  @sap.quickinfo : 'Earliest Scheduled Teardown Start Time'
  OpErlstSchedldTrdwnStrtTme : Time;
  @sap.label : 'Scheduled Execution Duration'
  @sap.quickinfo : 'Earliest Scheduled Execution Duration in Workdays'
  ErlstSchedldExecDurnInWorkdays : Integer;
  @sap.label : 'Actual Execution Duration'
  @sap.quickinfo : 'Actual Execution Duration in Workdays'
  OpActualExecutionDays : Integer;
  @sap.label : 'Operation Unit'
  @sap.quickinfo : 'Operation Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  OperationUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  OperationUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  OperationUnitSAPCode : String(3);
  @sap.unit : 'OperationUnit'
  @sap.label : 'Operation Quantity'
  @sap.quickinfo : 'Operation Total Quantity'
  OpPlannedTotalQuantity : Decimal(13, 3);
  @sap.unit : 'OperationUnit'
  @sap.label : 'Confirmed Yield'
  @sap.quickinfo : 'Total Confirmed Yield'
  OpTotalConfirmedYieldQty : Decimal(13, 3);
  @sap.label : 'Work Quantity Unit 1'
  @sap.quickinfo : 'Standard Work Quantity Unit 1'
  @sap.semantics : 'unit-of-measure'
  WorkCenterStandardWorkQtyUnit1 : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  StdWrkQtyUnit1ISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  StdWrkQtyUnit1SAPCode : String(3);
  @sap.unit : 'WorkCenterStandardWorkQtyUnit1'
  @sap.label : 'Standard Value'
  WorkCenterStandardWorkQty1 : Decimal(9, 3);
  @sap.label : 'Work Quantity Unit 2'
  @sap.quickinfo : 'Standard Work Quantity Unit 2'
  @sap.semantics : 'unit-of-measure'
  WorkCenterStandardWorkQtyUnit2 : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  StdWrkQtyUnit2ISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  StdWrkQtyUnit2SAPCode : String(3);
  @sap.unit : 'WorkCenterStandardWorkQtyUnit2'
  @sap.label : 'Standard Value'
  WorkCenterStandardWorkQty2 : Decimal(9, 3);
  @sap.label : 'Work Quantity Unit 3'
  @sap.quickinfo : 'Standard Work Quantity Unit 3'
  @sap.semantics : 'unit-of-measure'
  WorkCenterStandardWorkQtyUnit3 : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  StdWrkQtyUnit3ISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  StdWrkQtyUnit3SAPCode : String(3);
  @sap.unit : 'WorkCenterStandardWorkQtyUnit3'
  @sap.label : 'Standard Value'
  WorkCenterStandardWorkQty3 : Decimal(9, 3);
  @sap.label : 'Work Quantity Unit 4'
  @sap.quickinfo : 'Standard Work Quantity Unit 4'
  @sap.semantics : 'unit-of-measure'
  WorkCenterStandardWorkQtyUnit4 : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  StdWrkQtyUnit4ISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  StdWrkQtyUnit4SAPCode : String(3);
  @sap.unit : 'WorkCenterStandardWorkQtyUnit4'
  @sap.label : 'Standard Value'
  WorkCenterStandardWorkQty4 : Decimal(9, 3);
  @sap.label : 'Work Quantity Unit 5'
  @sap.quickinfo : 'Standard Work Quantity Unit 5'
  @sap.semantics : 'unit-of-measure'
  WorkCenterStandardWorkQtyUnit5 : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  StdWrkQtyUnit5ISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  StdWrkQtyUnit5SAPCode : String(3);
  @sap.unit : 'WorkCenterStandardWorkQtyUnit5'
  @sap.label : 'Standard Value'
  WorkCenterStandardWorkQty5 : Decimal(9, 3);
  @sap.label : 'Work Quantity Unit 6'
  @sap.quickinfo : 'Standard Work Quantity Unit 6'
  @sap.semantics : 'unit-of-measure'
  WorkCenterStandardWorkQtyUnit6 : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  StdWrkQtyUnit6ISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  StdWrkQtyUnit6SAPCode : String(3);
  @sap.unit : 'WorkCenterStandardWorkQtyUnit6'
  @sap.label : 'Standard Value'
  WorkCenterStandardWorkQty6 : Decimal(9, 3);
  LastChangeDateTime : String(14);
} actions {
  action ScheduleProductionOrderOperation(
    @sap.label : 'Order'
    ManufacturingOrder : String(12) not null,
    @odata.Type : 'Edm.DateTime'
    @sap.label : 'Execution Start Date'
    OpSchedldStartDate : DateTime,
    @sap.label : 'Execution Start Time'
    OpSchedldStartTime : Time,
    @odata.Type : 'Edm.DateTime'
    @sap.label : 'Execution End Date'
    OpSchedldEndDate : DateTime,
    @sap.label : 'Execution End Time'
    OpSchedldEndTime : Time,
    @sap.label : 'Scheduling type'
    OpSchedulingMode : String(1) not null,
    @sap.label : 'Status'
    OpSchedulingStatus : String(4),
    @sap.label : 'Component of the Version Number'
    OpSchedulingStrategy : String(4) not null
  ) returns API_PRODUCTION_ORDER_2_SRV.SchedldProdOrdOpMessage;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Order Status'
entity API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderStatus_2 {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Order'
  key ManufacturingOrder : String(12) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Status'
  @sap.quickinfo : 'Object status'
  key StatusCode : String(5) not null;
  @sap.label : 'Is User Status'
  IsUserStatus : Boolean;
  @sap.label : 'Status'
  @sap.quickinfo : 'Individual status of an object (short form)'
  StatusShortName : String(4);
  @sap.label : 'Status'
  @sap.quickinfo : 'Individual Status of an Object'
  StatusName : String(30);
};

@cds.external : true
@cds.persistence.skip : true
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Order'
entity API_PRODUCTION_ORDER_2_SRV.A_ProductionOrder_2 {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Order'
  key ManufacturingOrder : String(12) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Category'
  ManufacturingOrderCategory : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  ManufacturingOrderType : String(4);
  @sap.label : 'Long Text'
  OrderLongText : String;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Importance'
  @sap.quickinfo : 'Order Importance Code'
  ManufacturingOrderImportance : String(1);
  OrderIsCreated : String(1);
  OrderIsReleased : String(1);
  OrderIsPrinted : String(1);
  OrderIsConfirmed : String(1);
  OrderIsPartiallyConfirmed : String(1);
  OrderIsDelivered : String(1);
  OrderIsDeleted : String(1);
  OrderIsPreCosted : String(1);
  SettlementRuleIsCreated : String(1);
  OrderIsPartiallyReleased : String(1);
  OrderIsLocked : String(1);
  OrderIsTechnicallyCompleted : String(1);
  OrderIsClosed : String(1);
  OrderIsPartiallyDelivered : String(1);
  OrderIsMarkedForDeletion : String(1);
  SettlementRuleIsCrtedManually : String(1);
  OrderIsScheduled : String(1);
  OrderHasGeneratedOperations : String(1);
  OrderIsToBeHandledInBatches : String(1);
  MaterialAvailyIsNotChecked : String(1);
  @sap.display.format : 'Date'
  @sap.label : 'Order Creation Date'
  MfgOrderCreationDate : Date;
  @sap.label : 'Order Creation Time'
  MfgOrderCreationTime : Time;
  LastChangeDateTime : String(14);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number for Order'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Location'
  StorageLocation : String(4);
  @sap.label : 'Goods Recipient'
  GoodsRecipientName : String(12);
  @sap.label : 'Unloading Point'
  UnloadingPointName : String(25);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Inventory Usability'
  @sap.quickinfo : 'Inventory Usability Code'
  InventoryUsabilityCode : String(1);
  @sap.label : 'GR Processing Time'
  @sap.quickinfo : 'Goods Receipt Processing Duration in Days'
  MaterialGoodsReceiptDuration : Decimal(3, 0);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Key'
  @sap.quickinfo : 'MRP Distribution Key'
  QuantityDistributionKey : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Stock Segment'
  StockSegment : String(40);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Internal ID'
  OrderInternalBillOfOperations : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Planning Plant'
  @sap.quickinfo : 'Planning Plant for an Order'
  Plant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Area'
  MRPArea : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Controller'
  MRPController : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Supervisor'
  ProductionSupervisor : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Version'
  ProductionVersion : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Planned Order'
  PlannedOrder : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Order Item'
  SalesOrderItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Basic Scheduling Type'
  BasicSchedulingType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Object Number'
  @sap.quickinfo : 'Object Internal ID'
  ManufacturingObject : String(22);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Prod. Configuration'
  @sap.quickinfo : 'Product Configuration'
  ProductConfiguration : String(18);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sequence Number'
  @sap.quickinfo : 'Sequence Number Order'
  OrderSequenceNumber : String(14);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Business Area'
  BusinessArea : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Company Code'
  CompanyCode : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Profit Center'
  ProfitCenter : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Actual Costing Variant'
  @sap.quickinfo : 'Costing Variant For Actual Costs'
  ActualCostsCostingVariant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Planned Costing Variant'
  @sap.quickinfo : 'Costing Variant for Planned Costs'
  PlannedCostsCostingVariant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Functional Area'
  FunctionalArea : String(16);
  @sap.display.format : 'Date'
  @sap.label : 'Planned Start Date'
  @sap.quickinfo : 'Manufacturing Order Planned Start Date'
  MfgOrderPlannedStartDate : Date;
  @sap.label : 'Planned Start Time'
  @sap.quickinfo : 'Manufacturing Order Planned Start Time'
  MfgOrderPlannedStartTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Planned End Date'
  @sap.quickinfo : 'Manufacturing Order Planned End Date'
  MfgOrderPlannedEndDate : Date;
  @sap.label : 'Planned End Time'
  @sap.quickinfo : 'Manufacturing Order Planned End Time'
  MfgOrderPlannedEndTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Scheduled Start Date'
  @sap.quickinfo : 'Manufacturing Order Scheduled Start Date'
  MfgOrderScheduledStartDate : Date;
  @sap.label : 'Scheduled Start Time'
  @sap.quickinfo : 'Manufacturing Order Scheduled Start Time'
  MfgOrderScheduledStartTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Scheduled End Date'
  @sap.quickinfo : 'Manufacturing Order Scheduled End Date'
  MfgOrderScheduledEndDate : Date;
  @sap.label : 'Scheduled End Time'
  @sap.quickinfo : 'Manufacturing Order Scheduled End Time'
  MfgOrderScheduledEndTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Actual Release Date'
  @sap.quickinfo : 'Manufacturing Order Actual Release Date'
  MfgOrderActualReleaseDate : Date;
  @sap.label : 'Production Unit'
  @sap.quickinfo : 'Production Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  ProductionUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  ProductionUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  ProductionUnitSAPCode : String(3);
  @sap.unit : 'ProductionUnit'
  @sap.label : 'Total Quantity'
  @sap.quickinfo : 'Manufacturing Order Planned Total Quantity'
  TotalQuantity : Decimal(13, 3);
  @sap.unit : 'ProductionUnit'
  @sap.label : 'Scrap Quantity'
  @sap.quickinfo : 'Manufacturing Order Planned Scrap Quantity'
  MfgOrderPlannedScrapQty : Decimal(13, 3);
  @sap.unit : 'ProductionUnit'
  @sap.label : 'Confirmed Yield'
  @sap.quickinfo : 'Confirmed Yield Quantity From Order Confirmation'
  MfgOrderConfirmedYieldQty : Decimal(13, 3);
  @sap.label : 'Name of Customer'
  CustomerName : String(80);
  @sap.display.format : 'UpperCase'
  @sap.label : 'WBS Element'
  @sap.quickinfo : 'Work Breakdown Structure Element (WBS Element) Edited'
  WBSElementExternalID : String(24);
  @sap.label : 'Previous Production Order No'
  @sap.is.extension.field : 'true'
  YY1_PreviousProduction_ORD : String(20);
  to_ProdnOrdHeaderSerialNumber : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProdnOrderItemSerialNumber {  };
  to_ProductionOrderComponent : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderComponent_2 {  };
  to_ProductionOrderComponentExt : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderComponent_3 {  };
  to_ProductionOrderComponentExt4 : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderComponent_4 {  };
  to_ProductionOrderItem : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderItem_2 {  };
  to_ProductionOrderOperation : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderOperation_2 {  };
  to_ProductionOrderStatus : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProductionOrderStatus_2 {  };
  to_ProductionRsceTools : Association to many API_PRODUCTION_ORDER_2_SRV.A_ProductionRsceTools_2 {  };
} actions {
  action ReleaseOrder() returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
  action ReleaseOperation(
    ManufacturingOrderOperation : String(4),
    ManufacturingOrderSequence : String
  ) returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
  action TechlyCmpltOrder() returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
  action CloseOrder() returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
  action DeletionFlagOrder() returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
  action DeletionIndOrder() returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
  action DiscardOrder() returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
  action DeliveryCompletedOrder() returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
  action OrderReleasedByMES() returns API_PRODUCTION_ORDER_2_SRV.FunctionMessage;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Production Resources Tools'
entity API_PRODUCTION_ORDER_2_SRV.A_ProductionRsceTools_2 {
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Internal ID'
  key OrderInternalBillOfOperations : String(10) not null;
  @sap.display.format : 'NonNegative'
  @sap.label : 'PRT Item Counter'
  @sap.quickinfo : 'Item Counter for Production Resources/Tools'
  key MfgOrderOpProdnRsceToolIntID : String(8) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Resource/Tool'
  @sap.quickinfo : 'Production Resource/Tool Number'
  ProductionResourceTool : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'PRT Category'
  @sap.quickinfo : 'Production Resources/Tools Category'
  ProdnRsceToolCategory : String(1);
  @sap.label : 'PRT Category Name'
  @sap.quickinfo : 'Language-dependent description of the PRT category'
  ProdnRsceToolCategoryName : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'PRT Control Profile'
  @sap.quickinfo : 'Control Profile for Management of Production Resources/Tools'
  ProdnRsceToolControlProfile : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  ProdnRsceToolPlant : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Operation Internal ID'
  @sap.quickinfo : 'Internal Identifier of an Operation or Activity'
  OrderOperationInternalID : String(8);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Order'
  ManufacturingOrder : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Operation or Phase'
  @sap.quickinfo : 'Operation or Phase Number'
  ManufacturingOrderOperation : String(4);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Order Category'
  @sap.quickinfo : 'Manufacturing Order Category'
  ManufacturingOrderCategory : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Type'
  @sap.quickinfo : 'Manufacturing Order Type'
  ManufacturingOrderType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Task List Type'
  BillOfOperationsType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Group'
  @sap.quickinfo : 'Key for Task List Group'
  BillOfOperationsGroup : String(8);
  @sap.display.format : 'Date'
  @sap.label : 'Earliest Start Date'
  @sap.quickinfo : 'Earliest Scheduled Start Date for PRT Usage'
  EarliestSchedldUsageStartDate : Date;
  @sap.label : 'Earliest Start Time'
  @sap.quickinfo : 'Earliest Scheduled Start Time for PRT Usage'
  EarliestSchedldUsageStartTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Earliest End Date'
  @sap.quickinfo : 'Earliest Scheduled End Date of PRT Usage'
  EarliestSchedldUsageEndDate : Date;
  @sap.label : 'Earliest End Time'
  @sap.quickinfo : 'Earliest Scheduled End Time of PRT Usage'
  EarliestSchedldUsageEndTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Latest Start Date'
  @sap.quickinfo : 'Latest Scheduled Start Date for PRT Usage'
  LatestSchedldUsageStartDate : Date;
  @sap.label : 'Latest Start Time'
  @sap.quickinfo : 'Latest Scheduled Start Time for PRT Usage'
  LatestSchedldUsageStartTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Latest End Date'
  @sap.quickinfo : 'Latest Scheduled End Date for PRT Usage'
  LatestSchedldUsageEndDate : Date;
  @sap.label : 'Latest End Time'
  @sap.quickinfo : 'Latest Scheduled End Time for PRT Usage'
  LatestSchedldUsageEndTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Actual Start Date'
  @sap.quickinfo : 'Actual start date of PRT usage'
  ActualUsageStartDate : Date;
  @sap.label : 'Actual Start Time'
  @sap.quickinfo : 'Actual start time of PRT usage'
  ActualUsageStartTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Actual End Date'
  @sap.quickinfo : 'Actual end date of PRT usage'
  ActualUsageEndDate : Date;
  @sap.label : 'Actual End Time'
  @sap.quickinfo : 'Actual end time of PRT usage'
  ActualUsageEndTime : Time;
  @sap.label : 'Usage Duration Unit'
  @sap.quickinfo : 'Unit for Duration of PRT Usage'
  @sap.semantics : 'unit-of-measure'
  ProdnRsceToolUsageDurnUnit : String(3);
  @sap.label : 'Usage Duration'
  @sap.quickinfo : 'Duration of PRT Usage'
  ProdnRsceToolUsageDuration : Double;
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  PRTUsageDurationUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  PRTUsageDurationUnitSAPCode : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Quantity Formula'
  @sap.quickinfo : 'Formula for Calculating the Total Quantity of PRT'
  ProdnRsceToolTotQtyCalcFormula : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Usage Value Formula'
  @sap.quickinfo : 'Formula for Calculating the Total Usage Value of PRT'
  ProdnRsceToolUsageQtyCalcFmla : String(6);
  @sap.label : 'Unit for Quantity'
  @sap.quickinfo : 'Unit for Quantity of Production Resources/Tools'
  @sap.semantics : 'unit-of-measure'
  ProdnRsceToolStdWorkQtyUnit : String(3);
  @sap.unit : 'ProdnRsceToolStdWorkQtyUnit'
  @sap.label : 'Quantity'
  @sap.quickinfo : 'Standard Value for Quantity of Production Resources/Tools'
  ProdnRsceToolStandardWorkQty : Decimal(9, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  PRTStdWorkQtyUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  PRTStdWorkQtyUnitSAPCode : String(3);
  @sap.label : 'PRT Planned Quantity Unit'
  @sap.quickinfo : 'Unit for Total Planned Quantity of Production Resource/Tool'
  @sap.semantics : 'unit-of-measure'
  PlannedProdnRsceToolQtyUnit : String(3);
  @sap.unit : 'PlannedProdnRsceToolQtyUnit'
  @sap.label : 'Planned Quantity'
  @sap.quickinfo : 'Total Planned Quantity of Production Resource/Tool'
  PlannedTotalProdnRsceToolQty : Decimal(9, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  PlannedPRTQtyUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  PlannedPRTQtyUnitSAPCode : String(3);
  @sap.label : 'PRT Actual Quantity Unit'
  @sap.quickinfo : 'Unit for Actual Quantity of Production Resource/Tool'
  @sap.semantics : 'unit-of-measure'
  ConfirmedProdnRsceToolQtyUnit : String(3);
  @sap.unit : 'ConfirmedProdnRsceToolQtyUnit'
  @sap.label : 'Actual Quantity'
  @sap.quickinfo : 'Actual Quantity of Production Resource/Tool'
  ConfirmedProdnRsceToolQty : Decimal(9, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  ConfirmedPRTQtyUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  ConfirmedPRTQtyUnitSAPCode : String(3);
  @sap.label : 'Usage Value Unit'
  @sap.quickinfo : 'Usage Value Unit of the Production Resource/Tool'
  @sap.semantics : 'unit-of-measure'
  ProdnRsceToolUsageQuantityUnit : String(3);
  @sap.unit : 'ProdnRsceToolUsageQuantityUnit'
  @sap.label : 'Standard Usage Value'
  @sap.quickinfo : 'Standard Usage Value for Production Resources/Tools'
  ProdnRsceToolUsageQuantity : Decimal(9, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  PRTUsageQtyUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  PRTUsageQtyUnitSAPCode : String(3);
  @sap.label : 'Planned Usage Quantity Unit'
  @sap.quickinfo : 'Unit for Planned Usage Quantity of Production Resource/Tool'
  @sap.semantics : 'unit-of-measure'
  PlndProdnRsceToolUsageQtyUnit : String(3);
  @sap.unit : 'PlndProdnRsceToolUsageQtyUnit'
  @sap.label : 'Planned Usage Value'
  @sap.quickinfo : 'Total Planned Usage Value of Production Resource/Tool'
  PlannedProdnRsceToolUsageQty : Decimal(9, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  PlannedPRTUsageQtyUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  PlannedPRTUsageQtyUnitSAPCode : String(3);
  @sap.label : 'Actual Usage Quantity Unit'
  @sap.quickinfo : 'Unit for Actual Usage Quantity of Production Resource/Tool'
  @sap.semantics : 'unit-of-measure'
  ConfdProdnRsceToolUsageQtyUnit : String(3);
  @sap.unit : 'ConfdProdnRsceToolUsageQtyUnit'
  @sap.label : 'Actual Usage Value'
  @sap.quickinfo : 'Actual Usage Value for Production Resource/Tool'
  ConfirmedProdnRsceToolUsageQty : Decimal(9, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  ConfdPRTUsageQtyUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  ConfdPRTUsageQtyUnitSAPCode : String(3);
  @sap.label : 'Base Unit of Measure'
  @sap.quickinfo : 'Base Unit of Measure for Production Resources/Tools'
  @sap.semantics : 'unit-of-measure'
  ProdnRsceToolBaseUnit : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ISO Code'
  @sap.quickinfo : 'ISO Code for Unit of Measurement'
  ProdnRsceToolBaseUnitISOCode : String(3);
  @sap.label : 'Internal SAP Code'
  @sap.quickinfo : 'Unit of Measurement, Internal SAP Code (No Conversion)'
  ProdnRsceToolBaseUnitSAPCode : String(3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.label : 'Planned Order'
@sap.content.version : '1'
entity API_PRODUCTION_ORDER_2_SRV.A_PlannedOrderType {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Planned Order'
  key PlannedOrder : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Planned Order Type'
  PlannedOrderType : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plnned order profile'
  @sap.quickinfo : 'Planned order profile'
  PlannedOrderProfile : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Planning material'
  Material : String(40);
  @sap.label : 'Material Description'
  MaterialName : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Plant'
  ProductionPlant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Planning Plant'
  MRPPlant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Area'
  MRPArea : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Version'
  ProductionVersion : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Procurement Category'
  @sap.quickinfo : 'Material Procurement Category'
  MaterialProcurementCategory : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Procurement Type'
  @sap.quickinfo : 'Material Procurement Type'
  MaterialProcurementType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Location'
  StorageLocation : String(4);
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  BaseUnit : String(3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Total Order Quantity'
  @sap.quickinfo : 'Planned Total Order Quantity'
  TotalQuantity : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Scrap Quantity'
  @sap.quickinfo : 'Planned Scrap Quantity'
  PlndOrderPlannedScrapQty : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Quantity Received'
  @sap.quickinfo : 'Quantity of Goods Received'
  GoodsReceiptQty : Decimal(13, 3);
  @sap.unit : 'BaseUnit'
  @sap.label : 'Issued Quantity'
  IssuedQuantity : Decimal(13, 3);
  @sap.display.format : 'Date'
  @sap.label : 'Order Start Date'
  @sap.quickinfo : 'Planned Order Start Date'
  PlndOrderPlannedStartDate : Date;
  @sap.label : 'Order Start Time'
  @sap.quickinfo : 'Planned Order Start Time'
  PlndOrderPlannedStartTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Order End Date'
  @sap.quickinfo : 'Planned Order End Date'
  PlndOrderPlannedEndDate : Date;
  @sap.label : 'Order End Time'
  @sap.quickinfo : 'Planned Order End Time'
  PlndOrderPlannedEndTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Order Opening Date'
  @sap.quickinfo : 'Planned Opening Date in Planned Order'
  PlannedOrderOpeningDate : Date;
  @odata.Type : 'Edm.DateTimeOffset'
  @sap.label : 'Change Time Stamp'
  @sap.quickinfo : 'Last Change to Planned Order: Time Stamp'
  LastChangeDateTime : DateTime;
  @sap.display.format : 'Date'
  @sap.label : 'Production Start Date'
  @sap.quickinfo : 'Start Date for Production'
  ProductionStartDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Production End Date'
  @sap.quickinfo : 'End Date for Production'
  ProductionEndDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Order'
  SalesOrder : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Sales Order Item'
  SalesOrderItem : String(6);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  Customer : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'WBS Element Internal'
  @sap.quickinfo : 'Work Breakdown Structure Element Internal ID'
  WBSElementInternalID : String(24);
  @sap.display.format : 'UpperCase'
  @sap.label : 'WBS Element'
  WBSElement : String(24);
  @sap.label : 'WBS Element Name'
  @sap.quickinfo : 'Work Breakdown Structure Element Name'
  WBSDescription : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Account Assignment Category'
  AccountAssignmentCategory : String(1);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Reservation'
  @sap.quickinfo : 'Number of reservation/dependent requirements'
  Reservation : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'MRP Controller'
  MRPController : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Production Supervisor'
  ProductionSupervisor : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchasing Group'
  PurchasingGroup : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purch. Organization'
  @sap.quickinfo : 'Purchasing Organization'
  PurchasingOrganization : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Fixed Vendor'
  FixedSupplier : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchase Agreement'
  @sap.quickinfo : 'Purchase Schedule/Outline Agreement'
  PurchasingDocument : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Agreement Item'
  @sap.quickinfo : 'Purchase Schedule/Outline Agreement Item'
  PurchasingDocumentItem : String(5);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Quota Arrangement'
  QuotaArrangement : String(10);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Quota Arrangement Item'
  QuotaArrangementItem : String(3);
  @sap.label : 'Name of Supplier'
  SupplierName : String(80);
  @sap.label : 'Firming Indicator'
  @sap.quickinfo : 'Firming Indicator for Planned Order Data'
  PlannedOrderIsFirm : Boolean;
  @sap.label : 'Conversion Indicator'
  @sap.quickinfo : 'Planned Order Conversion Indicator'
  PlannedOrderIsConvertible : Boolean;
  @sap.label : 'BOM Fixing Indicator'
  @sap.quickinfo : 'Fixing Indicator for BOM Explosion'
  PlannedOrderBOMIsFixed : Boolean;
  @sap.label : 'Capacity Dispatched'
  @sap.quickinfo : 'Indicator: Capacity for Planned Order is Dispatched'
  PlannedOrderCapacityIsDsptchd : Boolean;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Capacity Requirement'
  @sap.quickinfo : 'ID of the Capacity Requirements Record'
  CapacityRequirement : String(12);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Capacity Requirement Origin'
  CapacityRequirementOrigin : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Task List Type'
  BillOfOperationsType : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Group'
  @sap.quickinfo : 'Key for Task List Group'
  BillOfOperationsGroup : String(8);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Group Counter'
  BillOfOperations : String(2);
  @sap.display.format : 'Date'
  @sap.label : 'Scheduled on'
  @sap.quickinfo : 'Date of the Last Scheduling'
  LastScheduledDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Scheduled finish'
  ScheduledBasicEndDate : Date;
  @sap.label : 'Earliest finish'
  @sap.quickinfo : 'Earliest finish of operation (time)'
  ScheduledBasicEndTime : Time;
  @sap.display.format : 'Date'
  @sap.label : 'Scheduled start'
  ScheduledBasicStartDate : Date;
  @sap.label : 'Earliest start time'
  @sap.quickinfo : 'Earliest scheduled start: Execution (time)'
  ScheduledBasicStartTime : Time;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Scheduling Type'
  SchedulingType : String(1);
} actions {
  action ConvertPlndOrder(
    ManufacturingOrder : String(12),
    ManufacturingOrderType : String
  ) returns API_PRODUCTION_ORDER_2_SRV.A_ProductionOrder_2;
};

@cds.external : true
type API_PRODUCTION_ORDER_2_SRV.SchedldProdOrdOpMessage {
  @sap.label : 'Order'
  ManufacturingOrder : String(12);
  OrderInternalBillOfOperations : String;
  OrderIntBillOfOperationsItem : String;
  @sap.label : 'Activity'
  ManufacturingOrderOperation : String(4);
  Message : String;
};

@cds.external : true
type API_PRODUCTION_ORDER_2_SRV.FunctionMessage {
  @sap.label : 'Message Type'
  SystemMessageType : String(1);
  @sap.label : 'Message Class'
  SystemMessageIdentification : String(20);
  @sap.label : 'Message Number'
  SystemMessageNumber : String(3);
  @sap.label : 'Message Text'
  SystemMessageLongText : String(220);
  @sap.label : 'Message Variable'
  SystemMessageVariable1 : String(50);
  @sap.label : 'Message Variable'
  SystemMessageVariable2 : String(50);
  @sap.label : 'Message Variable'
  SystemMessageVariable3 : String(50);
  @sap.label : 'Message Variable'
  SystemMessageVariable4 : String(50);
};

