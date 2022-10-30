<template>
  <div class="orders">
    <bread-crumb :menuList="menuList"></bread-crumb>
    <el-card class="cardlist">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              v-model="paramsObj.query"
              class="input-with-select"
            >
              <el-button
                @click="getOrdersData"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-table class="cardlist" :data="orders" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款"></el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogVisible = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="logistics(row.user_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagin-ation
        :page.sync="paramsObj.pagenum"
        :limit.sync="paramsObj.pagesize"
        :total="total"
        @pagination="getOrdersData"
      ></pagin-ation>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="editDialogVisible">
      <el-form :model="ordersForm" :rules="ordersRules" ref="editOrderRef">
        <el-form-item label="省市区/县" label-width="80px">
          <el-cascader
            v-model="selectedCityKey"
            :options="cityOptions"
            clearable
            @change="handlerChange"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="is_send" label="详细地址" label-width="80px">
          <el-input v-model="ordersForm.is_send" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="logisticsDialogVisible" title="物流进度">
      <div></div>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import PaginAtion from "@/components/PaginAtion.vue";
import cityOptions from "@/utils/city_data2017_element";
import { getOrders, getlogistics } from "@/api/order";
export default {
  components: { BreadCrumb, PaginAtion },
  data() {
    return {
      menuList: ["订单管理", "订单列表"],
      orders: [],
      paramsObj: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      ordersForm: {},
      cityOptions: cityOptions,
      selectedCityKey: [],
      ordersRules: {},
      editDialogVisible: false,
      logisticsDialogVisible: false,
      logisticNumber: "804909574412544580",
    };
  },
  mounted() {
    this.getOrdersData();
  },
  methods: {
    async getOrdersData() {
      const { goods, total } = await getOrders(this.paramsObj);
      this.orders = goods;
      this.total = total;
    },
    handlerChange() {},
    async logistics(id) {
      this.logisticsDialogVisible = true;
      await getlogistics(id, this.logisticNumber);
    },
  },
};
</script>

<style lang="less" scoped>
.cardlist {
  margin-top: 15px;
}
</style>