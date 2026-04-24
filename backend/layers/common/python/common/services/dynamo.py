import boto3
from ..utils.logger import setup_logger

logger = setup_logger('dynamo-service')


class DynamoConnection:
    def __init__(self, table_name):
        try:
            self.table_name = table_name
            self.__create_connection(self.table_name)
        except Exception as ex:
            logger.error(ex)
            logger.error("Error initializing dynamodb connection. Have you set the appropriate table_name environment variable?")

    def __create_connection(self, table_name):
        self.dynamo_client = boto3.client('dynamodb')
        self.dynamo_resource = boto3.resource('dynamodb')
        self.dynamo_table = self.dynamo_resource.Table(table_name)
        self.paginator = self.dynamo_client.get_paginator('query')

    @staticmethod
    def build_update_components(attributes=None, remove_paths=None):
        attributes = attributes or {}
        remove_paths = remove_paths or []
        if not attributes and not remove_paths:
            raise ValueError("attributes and remove_paths must not both be empty")

        set_parts = []
        remove_parts = []
        expression_attribute_names = {}
        expression_attribute_values = {}
        name_index = 0

        for value_index, (attribute_path, value) in enumerate(attributes.items()):
            path_tokens = []
            for path_part in attribute_path.split('.'):
                name_token = f"#n{name_index}"
                expression_attribute_names[name_token] = path_part
                path_tokens.append(name_token)
                name_index += 1

            value_token = f":v{value_index}"
            expression_attribute_values[value_token] = value
            set_parts.append(f"{'.'.join(path_tokens)} = {value_token}")

        for attribute_path in remove_paths:
            path_tokens = []
            for path_part in attribute_path.split('.'):
                name_token = f"#n{name_index}"
                expression_attribute_names[name_token] = path_part
                path_tokens.append(name_token)
                name_index += 1
            remove_parts.append(".".join(path_tokens))

        expression_parts = []
        if set_parts:
            expression_parts.append("SET " + ", ".join(set_parts))
        if remove_parts:
            expression_parts.append("REMOVE " + ", ".join(remove_parts))

        return {
            "UpdateExpression": " ".join(expression_parts),
            "ExpressionAttributeNames": expression_attribute_names,
            "ExpressionAttributeValues": expression_attribute_values,
        }

    def update_attributes(self, key, attributes=None, remove_paths=None, require_existing=True, return_values="ALL_NEW"):
        update_kwargs = {
            "Key": key,
            "ReturnValues": return_values,
            **self.build_update_components(attributes, remove_paths),
        }

        if not update_kwargs["ExpressionAttributeValues"]:
            del update_kwargs["ExpressionAttributeValues"]

        if require_existing:
            condition_parts = []
            for index, key_name in enumerate(key):
                key_token = f"#k{index}"
                update_kwargs["ExpressionAttributeNames"][key_token] = key_name
                condition_parts.append(f"attribute_exists({key_token})")
            update_kwargs["ConditionExpression"] = " AND ".join(condition_parts)

        return self.dynamo_table.update_item(**update_kwargs)

    def get_item(self, key):
        response = self.dynamo_table.get_item(Key=key)
        return response.get("Item")

    def put_item(self, item):
        return self.dynamo_table.put_item(Item=item)

    def delete_item(self, key):
        return self.dynamo_table.delete_item(Key=key)

    def query(self, **kwargs):
        return self.dynamo_table.query(**kwargs)

    def scan(self, **kwargs):
        return self.dynamo_table.scan(**kwargs)

    def scan_all(self, **kwargs):
        items = []
        scan_kwargs = dict(kwargs)
        while True:
            response = self.dynamo_table.scan(**scan_kwargs)
            items.extend(response.get('Items', []))
            last_evaluated_key = response.get('LastEvaluatedKey')
            if not last_evaluated_key:
                break
            scan_kwargs['ExclusiveStartKey'] = last_evaluated_key
        return items
