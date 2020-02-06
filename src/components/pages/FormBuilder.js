import React, { Component } from 'react'

class Pages extends Component {

  constructor () {
    super()
    this.state = {}
  }

  render () {
    return (
      <div className="main-content">

        {/*<div className="txt-site txt-18 txt-bold txt-main margin-bottom-5px margin-top-5px margin-left-5px">
          Form Static
        </div>*/}

        <div className="padding-5px">
          <form>

            {/* Hilangkan grid agar tampilan vertical */}

            <div className="grid grid-2x-colmin5 grid-mobile-none gap-15px">
              <div className="col-1">

                <div className="card-form margin-bottom-15px">
                  <div className="cf-header">
                    <div className="cf-title">
                      Data Barang
                    </div>
                    <div className="cf-subtitle">
                      A small river named Duden flows by their place and supplies it with the necessary regelialia.
                    </div>
                  </div>
                  <div className="cf-body">

                    <div className="cf-field">
                      <label className="cf-label">Nama barang</label><label className="cf-important">*</label>
                      <input type="text" className="cf-input txt txt-sekunder" required />
                      <label className="cf-message">Nama barang masih dapat diubah selama barang belum masuk transaksi</label>
                    </div>

                    <div className="cf-field">
                      <label className="cf-label">Kategori barang</label><label className="cf-important">*</label>
                      <select className="cf-input slc slc-sekunder">
                        <option value="1">opsi kategori</option>
                        <option value="1">opsi kategori</option>
                        <option value="1">opsi kategori</option>
                        <option value="1">opsi kategori</option>
                      </select>
                    </div>

                  </div>
                  <div className="cf-footer"></div>
                </div>

                <div className="card-form margin-bottom-15px">
                  <div className="cf-header">
                    <div className="cf-title">
                      Deskripsi Barang
                    </div>
                    <div className="cf-subtitle">
                      A small river named Duden flows by their place and supplies it with the necessary regelialia.
                    </div>
                  </div>
                  <div className="cf-body">

                    <div className="cf-field">
                      <label className="cf-label">Deskripsi barang</label><label className="cf-important">*</label>
                      <textarea className="cf-input txt txt-sekunder edit-text" maxLength={'30'}></textarea>
                      <label className="cf-message">Deskripsi barang minimum berjumlah 30 karakter</label>
                    </div>

                    <div className="cf-field">
                      <label className="cf-label">Video</label>
                      <input type="url" className="cf-input txt txt-sekunder" />
                      <label className="cf-message">Masukkan URL video yang mendeskripsikan barang dari</label><label className="cf-important">youtube</label>
                    </div>

                  </div>
                  <div className="cf-footer"></div>
                </div>

                <div className="card-form margin-bottom-15px">
                  <div className="cf-header">
                    <div className="cf-title">
                      Detail Barang
                    </div>
                    <div className="cf-subtitle">
                      A small river named Duden flows by their place and supplies it with the necessary regelialia.
                    </div>
                  </div>
                  <div className="cf-body">

                    <div className="cf-field">
                      <label className="cf-label">Harga satuan</label><label className="cf-important">*</label>
                      <input type="text" className="cf-input txt txt-sekunder" required />
                      <label className="cf-message">Harga barang harus kelipatan 100</label>
                    </div>

                    <div className="cf-field">
                      <label className="cf-label">Stok</label><label className="cf-important">*</label>
                      <div className="width width-200px">
                        <input type="number" className="cf-input txt txt-sekunder" required />
                      </div>
                      <label className="cf-message">Barang yang stoknya habis akan otomatis di-set tidak dijual.</label>
                    </div>

                    <div className="cf-field">
                      <label className="cf-label">Kondisi barang</label>
                      <div className="cf-input width width-300px display-flex-normal">
                        
                        <label className="radio">
                          <input type="radio" name="status" />
                          <span className="checkmark" />
                          <span className="txt-site txt-11 txt-bold txt-main">
                            Baru
                          </span>
                        </label>

                        <label className="radio">
                          <input type="radio" name="status" />
                          <span className="checkmark" />
                          <span className="txt-site txt-11 txt-bold txt-main">
                            Lama
                          </span>
                        </label>

                      </div>
                    </div>

                  </div>
                  <div className="cf-footer"></div>
                </div>

                <div className="card-form margin-bottom-15px">
                  <div className="cf-header">
                    <div className="cf-title">
                      Metode
                    </div>
                    <div className="cf-subtitle">
                      A small river named Duden flows by their place and supplies it with the necessary regelialia.
                    </div>
                  </div>
                  <div className="cf-body">

                    <div className="cf-field margin-bottom-15px">
                      <label className="cf-label">Metode pembelian</label>
                      <div className="width width-300px">
                        
                        <label className="checkbox margin-10px">
                          <input type="checkbox" />
                          <span className="checkmark" />
                          <span className="txt-site txt-11 txt-top txt-bold txt-main">
                            Pembayaran secara cash
                          </span>
                        </label>

                        <label className="checkbox margin-10px">
                          <input type="checkbox" />
                          <span className="checkmark" />
                          <span className="txt-site txt-11 txt-top txt-bold txt-main">
                            Pembayaran secara credit
                          </span>
                        </label>

                      </div>
                    </div>

                    <div className="padding-bottom-5px"></div>

                    <div className="cf-field">
                      <label className="cf-label">Metode pengiriman</label>
                      <div className="width width-300px">
                        
                        <label className="checkbox margin-10px">
                          <input type="checkbox" />
                          <span className="checkmark" />
                          <span className="txt-site txt-11 txt-top txt-bold txt-main">
                            Cash On Delivery
                          </span>
                        </label>

                        <label className="checkbox margin-10px">
                          <input type="checkbox" />
                          <span className="checkmark" />
                          <span className="txt-site txt-11 txt-top txt-bold txt-main">
                            JNE
                          </span>
                        </label>

                      </div>
                    </div>

                  </div>
                  <div className="cf-footer"></div>
                </div>

                <div className="card-form margin-bottom-15px">
                  <div className="cf-header">
                    <div className="grid grid-2x-colmin9">
                      <div className="col-1">
                        <div className="cf-title">
                          Private Barang
                        </div>
                        <div className="cf-subtitle">
                          A small river named Duden flows by their place and supplies it with the necessary regelialia.
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <div className="cf-field">
                          <label className="switch red">
                            <input type="checkbox" />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-form margin-bottom-15px">
                  <div className="cf-header">
                    <div className="cf-title">
                      Opsi
                    </div>
                  </div>
                  <div className="cf-body">
                    <div className="grid grid-2x gap-15px">
                      <div className="col-1">
                        <button type="button" className="btn btn-sekunder border-all btn-width-all">
                          Simpan ke draf
                        </button>
                      </div>
                      <div className="col-1">
                        <button type="submit" className="btn btn-green btn-width-all">
                          Publish
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cf-footer"></div>
                </div>
                
              </div>

              {/* hapus content-fixed-right agar componenet tidak melayang */}
              <div className="col-2 content-fixed-right">

                <div className="card-form">
                  <div className="cf-header">
                    <div className="cf-title">
                      Opsi
                    </div>
                  </div>
                  <div className="cf-body">
                    <div className="grid grid-2x gap-15px">
                      <div className="col-1">
                        <button type="button" className="btn btn-sekunder border-all btn-width-all">
                          Simpan ke draf
                        </button>
                      </div>
                      <div className="col-1">
                        <button type="submit" className="btn btn-green btn-width-all">
                          Publish
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cf-footer"></div>
                </div>
                
              </div>
            </div>

          </form>
        </div>

      </div>

    )
  }
}

export default Pages