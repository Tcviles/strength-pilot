#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'layers/common/python'))

from common.domain.exercise_seed import build_seed_exercises  # noqa: E402


def resolve_table_name(stage: str, explicit_table: str | None) -> str:
    if explicit_table:
        return explicit_table
    env_table = os.getenv('EXERCISES_TABLE')
    if env_table:
        return env_table
    return f'strength-pilot-{stage}-exercises'


def to_dynamo_attribute(value):
    if isinstance(value, bool):
        return {'BOOL': value}
    if isinstance(value, str):
        return {'S': value}
    if isinstance(value, list):
        return {'L': [to_dynamo_attribute(item) for item in value]}
    if isinstance(value, dict):
        return {'M': {key: to_dynamo_attribute(item) for key, item in value.items()}}
    if value is None:
        return {'NULL': True}
    if isinstance(value, (int, float)):
        return {'N': str(value)}
    raise TypeError(f'Unsupported DynamoDB value type: {type(value).__name__}')


def put_item_via_aws_cli(table_name: str, record: dict, profile: str | None, region: str) -> None:
    dynamo_item = {key: to_dynamo_attribute(value) for key, value in record.items()}

    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as handle:
        json.dump(dynamo_item, handle)
        temp_path = handle.name

    try:
        command = [
            'aws',
            'dynamodb',
            'put-item',
            '--table-name',
            table_name,
            '--item',
            f'file://{temp_path}',
            '--region',
            region,
        ]
        if profile:
            command.extend(['--profile', profile])

        subprocess.run(command, check=True, capture_output=True, text=True)
    finally:
        os.unlink(temp_path)


def main() -> int:
    parser = argparse.ArgumentParser(description='Seed canonical exercises into DynamoDB.')
    parser.add_argument('--stage', default=os.getenv('STAGE', 'dev'))
    parser.add_argument('--table', default=None)
    parser.add_argument('--profile', default=os.getenv('AWS_PROFILE'))
    parser.add_argument('--region', default=os.getenv('AWS_REGION', 'us-east-1'))
    args = parser.parse_args()

    table_name = resolve_table_name(args.stage, args.table)
    exercises = build_seed_exercises()

    for exercise in exercises:
        put_item_via_aws_cli(
            table_name=table_name,
            record=exercise.to_record(),
            profile=args.profile,
            region=args.region,
        )

    print(f'Seeded {len(exercises)} exercises into {table_name} via AWS CLI')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
