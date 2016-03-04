# coding: utf-8
# pylint: disable=too-few-public-methods, no-self-use, missing-docstring, unused-argument
"""
Provides API logic relevant to positions
"""
from flask_restful import reqparse, Resource

import auth
import util

from main import API
from model import Position
from api.helpers import ArgumentValidator, make_list_response, make_empty_ok_response
from flask import request, g
from pydash import _
from api.decorators import model_by_key, user_by_username, authorization_required, admin_required
from datetime import datetime

@API.resource('/api/v1/positions')
class PositionsAPI(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('cursor', type=ArgumentValidator.create('cursor'))
        parser.add_argument('description')
        parser.add_argument('location')
        args = parser.parse_args()

        positions_future = Position.query() \
            .order(-Position.created) \
            .fetch_page_async(10, start_cursor=args.cursor)

        total_count_future = Position.query().count_async(keys_only=True)
        positions, next_cursor, more = positions_future.get_result()
        positions = [p.to_json() for p in positions]
        positions = [p for p in positions if args.description.lower() in p["description"].lower()]
        positions = [p for p in positions if args.location.lower() in p["location"].lower()]
        return make_list_response(positions, next_cursor, more, total_count_future.get_result())

    def post(self):
        position_to_insert = request.get_json()
        print position_to_insert
        position = Position(
            created_at = str(datetime.now()),
            title = position_to_insert["title"],
            location = position_to_insert["location"],
            type = position_to_insert["type"],
            description = position_to_insert["description"],
            how_to_apply = position_to_insert["how_to_apply"],
            company = position_to_insert["company"],
            company_url = position_to_insert["company_url"],
            company_logo = position_to_insert["company_logo"],
        )
        position.put()
        return position.to_json(), 201

@API.resource('/api/v1/positions/<int:id>')
class PositionAPI(Resource):
    def get(self, id):
        position = Position.get_by_id(id)
        if position is None:
            return {}, 404
        return position.to_json()

    def put(self, id):
        position_to_insert = request.get_json()
        position = Position.get_by_id(id)
        position.title = position_to_insert["title"]
        position.location = position_to_insert["location"]
        position.type = position_to_insert["type"]
        position.description = position_to_insert["description"]
        position.how_to_apply = position_to_insert["how_to_apply"]
        position.company = position_to_insert["company"]
        position.company_url = position_to_insert["company_url"]
        position.company_logo = position_to_insert["company_logo"]
        position.url = position_to_insert["url"]
        position.put()
        return position.to_json()

    def delete(self, id):
        position = Position.get_by_id(id)
        position.key.delete()
        return "", 204
