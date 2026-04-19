from boto3.dynamodb.types import TypeDeserializer
from decimal import Decimal


def deserialize_dynamo(data, serializer=TypeDeserializer()):
    if isinstance(data, list):
        return [deserialize_dynamo(value) for value in data]

    if isinstance(data, dict):
        try:
            deserialized = serializer.deserialize(data)
            if isinstance(deserialized, Decimal):
                if deserialized % 1 == 0:
                    return int(deserialized)
                return float(deserialized)
            return deserialized
        except TypeError:
            return {key: deserialize_dynamo(value) for key, value in data.items()}

    if isinstance(data, Decimal):
        if data % 1 == 0:
            return int(data)
        return float(data)

    return data


def clean_decimals(obj):
    """Walk a structure and convert Dynamo Decimals to int/float for JSON serialization."""
    if isinstance(obj, list):
        return [clean_decimals(v) for v in obj]
    if isinstance(obj, dict):
        return {k: clean_decimals(v) for k, v in obj.items()}
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj
