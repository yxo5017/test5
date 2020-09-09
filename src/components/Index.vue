<template>
  <div class="index container">
    <h1>タスクの登録</h1>

    <!-- ４つの入力フォームを作成：カテゴリ、タイトル、詳細、ステータス -->
    <!--各入力フォームをクリックした際、clear＊＊関数が実行され、入力フォームが空になる。-->
    <input @click="clearCategory()" type="text" v-model="category">
    <input @click="clearTitle()" type="text" v-model="title">
    <input @click="clearDetail()" type="text" v-model="detail">
    <input @click="clearStatus()" type="text" v-model="status"><br>

    <!--submitボタンを押すと、firebaseへ上記の４項目が登録される。-->
    <button v-on:click="addList()">submit</button>

    <!--updateボタンは、テーブル表のeditボタンがクリックされると、表示される。-->
    <!--updateボタンを押すと、上記の４項目にテーブル表の中身がコピーされる。-->
    <!--コピーされた項目を修正することで、各テーブル項目のupdateができる。-->
    <!--詳しくはupdateList関数を参照する。-->
    <button v-if="HideUpdateButton()" v-on:click="updateList(id)">update</button>
    <br><br>

    <!--上記のclear＊＊関数と同様に、フォームをクリックすると入力フォームが空になる。-->
    <input @click="clearSearch()" v-model="searchWord"><br>

    <!--入力フォームで絞り込み検索をする。絞り込みの対象は全項目-->
    <button @click="sortBy()">絞り込み</button>

    <!--全件表示を押すと、絞り込みが解除されて全項目が再表示される。-->
    <!--また絞り込みの検索結果テーブルと。「検索結果」のタイトルが非表示になる。-->
    <button v-if="displayAllParams()" @click="displayAll()">全件表示</button>
    <button @click="testSearch()">検索テスト</button>
    <!--絞り込み検索されると、「検索結果＊＊件中＊＊件表示」と表示される。-->
    <p v-if="displayAllParams()">検索結果：{{ lists.length }}件中 {{ empty_list.length }} 表示</p>

    <!--デフォルト状態で表示されているテーブル-->
    <!--firebaseに保管されているデータを全て表示している。-->
    <table>
      <tr>
        <th>ID</th>
        <th>カテゴリ</th>
        <th>タイトル</th>
        <th>詳細</th>
        <th>ステータス</th>
      </tr>
      <tr v-for="(list, index) in lists" :key="list.id">
        <td width="30">{{ index + 1 }}</td>
        <td width="80">{{ list.category }}</td>
        <td width="80">{{ list.title }}</td>
        <td width="160">{{ list.detail }}</td>
        <td width="80">{{ list.status }}</td>
        <!--項目の削除をする。-->
        <td width="55"><button @click="deleteList(list.id)">delete</button></td>
        <!--項目の編集をする。-->
        <td width="40"><button @click="editList(list)">edit</button></td>
      </tr>
    </table>

  </div>
</template>

<script>
import db from '@/firebase/init'

export default {
  category: 'Index',
  data(){
    return{
      category: "カテゴリ",
      title: "タイトル",
      detail: "詳細",
      status: "ステータス",
      id: "id",
      edit_list: 1,
      table_display_params: 1,
      display_all_params: 1,
      lists: [],
      lists2: [],
      newArray: [],
      searchWord: 11,
      empty_list: [],
      search_params: 11,
      n: 0
    }
  },
  methods: {

    //deleteList関数は、firebaseから 'lists' と記載されたテーブルを取得している。
    deleteList(id){
      //firebase項目の削除作業：取得したテーブルの項目を、クリックされた削除ボタンのidに応じて削除している。
      db.collection('lists').doc(id).delete()
      .then(() => {
        //フロントの削除作業：上記と同様にクリックされた削除ボタンのidに応じて非表示にしている。
        this.lists = this.lists.filter(list => {
          return list.id != id
        })
      })
    },

    //firebaseへ入力された項目を登録している。
    addList(){
      db.collection('lists').add({
        category: this.category,
        title: this.title,
        detail: this.detail,
        status: this.status
      })
      db.collection('lists').get()
      .then(snapshot => {
        //let i = 0
        this.lists = []
        snapshot.forEach(doc => {

          let list = doc.data()

          list.id = doc.id

          this.lists.push(list)
        })
        //db.collection('lists')で全てのデータをとれている。
        //あとは全て表示させるコードを書くだけ
      }),

      console.log(this.lists)

      //登録後は、入力フォームをからにしている。
      this.category = null,
      this.title = null,
      this.detail = null,
      this.status = null
    },

    //テーブルの項目を編集している。
    editList(list){
      this.category = list.category,
      this.title = list.title,
      this.detail = list.detail,
      this.status = list.status,
      this.id = list.id,
      this.edit_list = 0
    },

    //編集をした際に表示されるupdateボタンを状況に応じて、表示・非表示にしている。
    HideUpdateButton(){
      if (this.edit_list == 0) {
        return true
      } else {
        return false
      }
    },

    //絞り込み検索がされた場合、デフォルト表示されていたテーブルは非表示となる。
    tableDisplayParams(){
      if (this.table_display_params == 1) {
        return true
      } else {
        return false
      }
    },

    //editボタンが押された際に、updateボタンが出現する。
    //updateボタンを押すと、入力フォーム内容の通り、テーブル表が更新される。
    updateList(id){
      db.collection('lists').doc(id).update({
        category: this.category,
        title: this.title,
        detail: this.detail,
        status: this.status
      })
      db.collection('lists').get()
      //入力フォームが更新された後は、入力フォームが空になる。
      .then(snapshot => {
        console.log(snapshot)
        this.lists = []
        snapshot.forEach(doc => {
          let list = doc.data()
          list.id = doc.id
          console.log(list)
          this.lists.push(list)
        })
        console.log(this.lists)
      }),
      this.category = null,
      this.title = null,
      this.detail = null,
      this.status = null,
      this.edit_list = 1
    },

    //以下の項目は、入力フォームがクリックされた際に、入力フォームを空にしている。
    clearCategory(){
      this.category = null
    },
    clearTitle(){
      this.title = null
    },
    clearDetail(){
      this.detail = null
    },
    clearStatus(){
      this.status = null
    },
    clearSearch(){
      this.searchWord = null
    },
    //「検索テスト」がクリックされたら、listsでループを回すのではなく、newArrayでループを回せばいい。
    testSearch(){
      db.collection('lists').get()
      .then(() => {
        if (this.lists[0].category == 22) {
          const num = this.searchWord
          this.newArray = this.lists.filter(function(list) {

            return list.category == num
            || list.title == num
            || list.detail == num
            || list.status == num
          })
        } else {
          alert("fail")
        }
        console.log(this.newArray)
      })
    },



    //テーブル表の全項目を検索している。
    //カテゴリ、タイトル、詳細、ステータスの項目をループさせている。
    //ループさせた上で、検索条件 this.searchWordが上記４項目にヒットしたら、
    //そのヒットした項目をnew_listという空の配列へ格納している。
    //new_listは最終的にempty_listへ格納され、こちらが検索結果として表示されるテーブルとなる。
    sortBy(){
      this.table_display_params = 0
      this.display_all_params = 0
      this.empty_list = []
      for (var i = 0; i < this.lists.length; i++){
        //カテゴリの検索
        var n = this.lists[i].category.search(this.searchWord)
        //タイトルの検索
        var m = this.lists[i].title.search(this.searchWord)
        //詳細の検索
        var l = this.lists[i].detail.search(this.searchWord)
        //ステータスの検索
        var r = this.lists[i].status.search(this.searchWord)
        //いずれかの項目にヒットした場合、new_listへ格納したいので、or条件を使っている。
        if (n != -1 || m != -1 || l != -1 || r!= -1){
          var new_list = [this.lists[i].category, this.lists[i].title, this.lists[i].detail, this.lists[i].status, this.lists[i].id]
          //テーブルに表示するempty_listへ格納している。
          this.empty_list.push(new_list)
        }
      }
    },

    //全件表示を押すと、絞り込み検索がされたテーブルを非表示、
    //デフォルトで表示されていたテーブルを再度表示する。
    displayAll(){
      this.table_display_params = 1
      this.display_all_params = 1
    },
    displayAllParams(){
      if (this.display_all_params == 1){
        return false
      } else {
        return true
      }
    }
  },
  mounted(){

    //firebaseからテーブル情報を取得して、こちらのファイルで定義した
    //lists = []という空の配列へ情報を書き込みしている。
    db.collection('lists').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let list = doc.data()
        list.id = doc.id
        this.lists.push(list)
      })
    })
  }
}
</script>

<style scoped>
h3 {
  width: 200px
}

</style>
