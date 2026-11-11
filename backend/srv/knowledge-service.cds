service KnowledgeService @(path: '/odata/v4/knowledge') {
  action ingestDocuments() returns LargeString;
  action searchKnowledge( question : String ) returns LargeString;
  action askAssistant( question : String ) returns LargeString;
  action askAgent( question : String, history : LargeString ) returns LargeString;
  action confirmAgentAction( tool : String, arguments : LargeString ) returns LargeString;
}
