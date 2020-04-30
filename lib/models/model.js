'use strict';

class Model {
  constructor(schema){
    this.schema = schema;
  }
  async create(record) {
    try{
    let createNew =  new this.schema(record);
    console.log('create', createNew)
    return  await createNew.save();
    }catch (e){
      console.error('error on create', e)
    }
  }

  async read(_id){
    try{
    let record = await this.schema.findById({_id});
    return record;
    }catch (e){
      console.error('error on read', e)
    }
  }

  async readByQuery(qurey){
    try{
    let results = await this.schema.find(qurey);
    return results;
    }catch (e){
      console.error('error read by query', e)
    }
  }

  async update(_id, data){
    console.log('id', _id)
    try{
      console.log('data', data)
   let results = await this.schema.findByIdAndUpdate(_id, data); 

   return results;
    }catch (e) {
      console.error('error on update', e)
    }
  }
  
  async delete(_id){
    try{
      let result = await this.schema.findByIdAndDelete(_id)
      return result;
    }catch (e){
      console.error('error in model delete', e)
    }
  }

}
module.exports = Model;