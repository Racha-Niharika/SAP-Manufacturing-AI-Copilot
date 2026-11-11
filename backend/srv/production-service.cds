using { manufacturing } from '../db/schema';

service ProductionService @(path: '/production') {
  @odata.draft.enabled: false
  entity ProductionOrders as projection on manufacturing.ProductionOrders;
  action fetchFromS4() returns LargeString;
}

annotate ProductionService.ProductionOrders with @(
  UI: {
    HeaderInfo: {
      TypeName: 'Production Order',
      TypeNamePlural: 'Production Orders',
      Title: { Value: orderNumber },
      Description: { Value: description }
    },
    SelectionFields: [
      orderNumber,
      material,
      status,
      plant
    ],
    PresentationVariant: {
      SortOrder: [
        {
          Property: orderNumber,
          Descending: false
        }
      ],
      Visualizations: ['@UI.LineItem']
    },
    LineItem: [
      { Value: orderNumber, Label: 'Production Order' },
      { Value: material, Label: 'Material' },
      { Value: description, Label: 'Description' },
      { Value: plannedQty, Label: 'Planned Quantity' },
      { Value: completedQty, Label: 'Completed Quantity' },
      { Value: status, Label: 'Status' },
      { Value: plant, Label: 'Plant' }
    ],
    Facets: [
      {
        $Type: 'UI.ReferenceFacet',
        ID: 'GeneralInfoFacet',
        Label: 'Order Information',
        Target: '@UI.FieldGroup#GeneralInfo'
      }
    ],
    FieldGroup #GeneralInfo: {
      $Type: 'UI.FieldGroupType',
      Data: [
        { Value: orderNumber, Label: 'Production Order' },
        { Value: material, Label: 'Material' },
        { Value: description, Label: 'Description' },
        { Value: plant, Label: 'Plant' },
        { Value: status, Label: 'Status' },
        { Value: plannedQty, Label: 'Planned Quantity' },
        { Value: completedQty, Label: 'Completed Quantity' }
      ]
    }
  }
);
